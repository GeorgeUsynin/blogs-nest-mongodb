import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { EmailConfirmationRequestedEvent } from '../events';
import { UserAccountsConfig } from '../../config';

export class ResendEmailConfirmationCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendEmailConfirmationCommand)
export class ResendEmailConfirmationUseCase implements ICommandHandler<ResendEmailConfirmationCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private userAccountsConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: ResendEmailConfirmationCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const confirmationCode = user.regenerateEmailConfirmationCode(
        this.userAccountsConfig
          .EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
      );
      await this.usersRepository.save(user);

      this.eventBus.publish(
        new EmailConfirmationRequestedEvent(email, confirmationCode),
      );
    }
  }
}
