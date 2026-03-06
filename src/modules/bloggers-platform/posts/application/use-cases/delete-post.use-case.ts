import { ICommandHandler } from '@nestjs/cqrs';
import { PostNotFoundError } from '../../../../../core/exceptions';
import { PostsRepository } from '../../infrastructure';

export class DeletePostCommand {
  constructor(public readonly id: string) {}
}

export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostCommand): Promise<void> {
    const foundPost = await this.postsRepository.findById(id);
    if (!foundPost) {
      throw new PostNotFoundError();
    }

    foundPost.makeDeleted();

    await this.postsRepository.save(foundPost);
  }
}
