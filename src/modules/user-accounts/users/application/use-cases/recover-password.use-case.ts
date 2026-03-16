import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { PasswordRecoveryRequestedEvent } from '../events';
import { UserAccountsConfig } from '../../config';

export class RecoverPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase implements ICommandHandler<RecoverPasswordCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private userAccountsConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: RecoverPasswordCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const recoveryCode = user.createAndUpdatePasswordRecoveryCode(
        this.userAccountsConfig.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS,
      );
      await this.usersRepository.save(user);

      this.eventBus.publish(
        new PasswordRecoveryRequestedEvent(email, recoveryCode),
      );
    }
  }
}
