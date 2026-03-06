import { ICommandHandler } from '@nestjs/cqrs';
import { CommentNotFoundError } from '../../../../../core/exceptions';
import { UpdateCommentDto } from '../dto';
import { CommentsRepository } from '../../infrastructure';

export class UpdateCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: UpdateCommentDto,
  ) {}
}

export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ userId, dto }: UpdateCommentCommand): Promise<void> {
    const { id, content } = dto;

    const foundComment = await this.commentsRepository.findById(id);
    if (!foundComment) {
      throw new CommentNotFoundError();
    }

    foundComment.ensureCommentOwner(userId);
    foundComment.updateContent(content);

    await this.commentsRepository.save(foundComment);
  }
}
