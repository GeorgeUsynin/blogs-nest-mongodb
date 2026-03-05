import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { UserNotFoundError } from '../../../../../core/exceptions';

export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    const foundUser = await this.usersRepository.findById(id);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    foundUser.makeDeleted();

    await this.usersRepository.save(foundUser);
  }
}
