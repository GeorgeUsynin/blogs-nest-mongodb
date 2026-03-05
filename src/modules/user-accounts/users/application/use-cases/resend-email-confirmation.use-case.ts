import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { EmailConfirmationRequestedEvent } from '../events';

export class ResendEmailConfirmationCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendEmailConfirmationCommand)
export class ResendEmailConfirmationUseCase implements ICommandHandler<ResendEmailConfirmationCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: ResendEmailConfirmationCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const confirmationCode = user.regenerateEmailConfirmationCode();
      await this.usersRepository.save(user);

      this.eventBus.publish(
        new EmailConfirmationRequestedEvent(email, confirmationCode),
      );
    }
  }
}
