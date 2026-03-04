import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../infrastructure';
import { PasswordHasherService } from './password-hasher.service';
import { CreateUserDto } from './dto';
import { User, type UserModelType } from '../domain';
import { UserNotFoundError } from '../../../../core/exceptions';

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

  async deleteUser(id: string): Promise<void> {
    const foundUser = await this.usersRepository.findById(id);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    foundUser.makeDeleted();

    await this.usersRepository.save(foundUser);
  }
}
