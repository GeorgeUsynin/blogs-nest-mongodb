import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure';
import { PasswordHasherService } from './password-hasher.service';
import { UserContextDto } from '../guards/dto';
import { EmailNotConfirmedError } from '../../../../core/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const isValidPassword = await this.passwordHasherService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) return null;

    if (!user.emailConfirmation.isConfirmed) {
      throw new EmailNotConfirmedError();
    }

    return { userId: user._id.toString() };
  }
}
