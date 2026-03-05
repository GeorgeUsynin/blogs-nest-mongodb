import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateUserDto } from '../dto';
import { UsersRepository } from '../../infrastructure';
import { UserCreationFailedError } from '../../../../../core/exceptions';
import { EmailConfirmationRequestedEvent } from '../events';
import { CreateUserCommand } from './create-user.use-case';

export class RegisterUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private commandBus: CommandBus,
    private eventBus: EventBus,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    const createdUserId = await this.commandBus.execute(
      new CreateUserCommand(dto),
    );

    const createdUser = await this.usersRepository.findById(createdUserId);

    if (!createdUser) {
      throw new UserCreationFailedError();
    }

    this.eventBus.publish(
      new EmailConfirmationRequestedEvent(
        createdUser.email,
        createdUser.emailConfirmation.confirmationCode!,
      ),
    );
  }
}
