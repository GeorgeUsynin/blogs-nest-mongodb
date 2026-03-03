import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure';
import { EmailManager } from '../../../notification';
import { UsersService } from './users.service';
import {
  InvalidConfirmationCode,
  UserCreationFailedError,
} from '../../../../core/exceptions';
import { CreateUserDto } from './dto';

@Injectable()
export class RegistrationService {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

  async registerNewUser(dto: CreateUserDto): Promise<void> {
    const userId = await this.usersService.createUser(dto);

    const createdUser = await this.usersRepository.findById(userId);

    if (!createdUser) {
      throw new UserCreationFailedError();
    }

    this.emailManager.sendConfirmationEmail(
      createdUser.email,
      createdUser.emailConfirmation.confirmationCode!,
    );
  }

  async confirmRegistration(code: string): Promise<void> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);

    if (!user) {
      throw new InvalidConfirmationCode();
    }

    user.confirmUserEmail(code);
    await this.usersRepository.save(user);
  }

  async resendEmailConfirmationCode(email: string): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const confirmationCode = user.regenerateEmailConfirmationCode();
      await this.usersRepository.save(user);

      this.emailManager.sendConfirmationEmail(email, confirmationCode);
    }
  }
}
