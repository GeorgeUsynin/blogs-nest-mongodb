import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure';
import { EmailManager } from '../../../notification';
import { InvalidPasswordRecoveryCode } from '../../../../core/exceptions';
import { PasswordHasherService } from './password-hasher.service';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private emailManager: EmailManager,
    private passwordHasherService: PasswordHasherService,
    private usersRepository: UsersRepository,
  ) {}

  async recoverPassword(email: string): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const recoveryCode = user.createAndUpdatePasswordRecoveryCode();
      await this.usersRepository.save(user);

      this.emailManager.sendPasswordRecoveryEmail(email, recoveryCode);
    }
  }

  async updateNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const user =
      await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);

    if (!user) {
      throw new InvalidPasswordRecoveryCode();
    }

    const passwordHash =
      await this.passwordHasherService.hashPassword(newPassword);

    user.updatePasswordByRecoveryCode(recoveryCode, passwordHash);
    await this.usersRepository.save(user);
  }
}
