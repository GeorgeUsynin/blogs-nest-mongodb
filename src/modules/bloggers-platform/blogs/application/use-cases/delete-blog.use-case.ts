import { ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure';
import { BlogNotFoundError } from '../../../../../core/exceptions';

export class DeleteBlogCommand {
  constructor(public readonly id: string) {}
}

export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<void> {
    const foundBlog = await this.blogsRepository.findById(id);

    if (!foundBlog) throw new BlogNotFoundError();

    foundBlog.makeDeleted();

    await this.blogsRepository.save(foundBlog);
  }
}
