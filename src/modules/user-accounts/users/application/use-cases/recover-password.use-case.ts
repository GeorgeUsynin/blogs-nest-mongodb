import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { PasswordRecoveryRequestedEvent } from '../events';

export class RecoverPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase implements ICommandHandler<RecoverPasswordCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: RecoverPasswordCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const recoveryCode = user.createAndUpdatePasswordRecoveryCode();
      await this.usersRepository.save(user);

      this.eventBus.publish(
        new PasswordRecoveryRequestedEvent(email, recoveryCode),
      );
    }
  }
}
