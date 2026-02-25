import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure';
import { PasswordHasherService } from './password-hasher.service';
import { CreateUserDto } from './dto';
import { User, UserDocument, type UserModelType } from '../domain';
import { CreateUserDomainDto } from '../domain/dto';

type TOptions = {
  shouldBeConfirmed: boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private passwordHasherService: PasswordHasherService,
    private usersRepository: UsersRepository,
  ) {}

  async createUser(
    dto: CreateUserDto,
    options: TOptions = { shouldBeConfirmed: false },
  ) {
    const { email, login, password } = dto;

    const userWithExistedLogin =
      await this.usersRepository.findUserByLogin(login);
    // if (userWithExistedLogin) {
    //   throw new LoginAlreadyExistsError();
    // }

    const userWithExistedEmail =
      await this.usersRepository.findUserByEmail(email);
    // if (userWithExistedEmail) {
    //   throw new EmailAlreadyExistsError();
    // }

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

  async deleteUser(id: string): Promise<void> {
    const foundUser = await this.usersRepository.findById(id);

    if (!foundUser) {
      // throw new UserNotFoundError();
      throw new Error();
    }

    foundUser.makeDeleted();

    await this.usersRepository.save(foundUser);
  }
}
