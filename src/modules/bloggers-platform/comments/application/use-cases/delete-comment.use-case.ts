import { ICommandHandler } from '@nestjs/cqrs';
import { CommentNotFoundError } from '../../../../../core/exceptions';
import { CommentsRepository } from '../../infrastructure';

export class DeleteCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {}
}

export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ userId, id }: DeleteCommentCommand): Promise<void> {
    const foundComment = await this.commentsRepository.findById(id);
    if (!foundComment) {
      throw new CommentNotFoundError();
    }

    foundComment.ensureCommentOwner(userId);
    foundComment.makeDeleted();

    await this.commentsRepository.save(foundComment);
  }
}
