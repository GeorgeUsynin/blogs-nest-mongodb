import { InjectModel } from '@nestjs/mongoose';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto';
import { CreateUserDomainDto } from '../../domain/dto';
import { UsersRepository } from '../../infrastructure';
import { User, UserDocument, type UserModelType } from '../../domain';
import { PasswordHasherService } from '../password-hasher.service';
import {
  EmailAlreadyExistsError,
  LoginAlreadyExistsError,
} from '../../../../../core/exceptions';

type TOptions = {
  shouldBeConfirmed: boolean;
};

export class CreateUserCommand extends Command<string> {
  constructor(
    public readonly dto: CreateUserDto,
    public readonly options: TOptions = { shouldBeConfirmed: false },
  ) {
    super();
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<
  CreateUserCommand,
  string
> {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private passwordHasherService: PasswordHasherService,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto, options }: CreateUserCommand): Promise<string> {
    const { email, login, password } = dto;

    const userWithExistedLogin =
      await this.usersRepository.findUserByLogin(login);
    if (userWithExistedLogin) {
      throw new LoginAlreadyExistsError();
    }

    const userWithExistedEmail =
      await this.usersRepository.findUserByEmail(email);
    if (userWithExistedEmail) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash =
      await this.passwordHasherService.hashPassword(password);

    let newUser: UserDocument | null = null;

    const createUserDomainDto: CreateUserDomainDto = {
      email,
      login,
      passwordHash,
    };

    if (options.shouldBeConfirmed) {
      newUser = this.UserModel.createConfirmedUser(createUserDomainDto);
    } else {
      newUser = this.UserModel.createUnconfirmedUser(createUserDomainDto);
    }

    await this.usersRepository.save(newUser);

    return newUser._id.toString();
  }
}
