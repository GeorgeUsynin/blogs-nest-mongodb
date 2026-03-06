import { Command, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, type BlogModelType } from '../../domain';
import { BlogsRepository } from '../../infrastructure';
import { CreateBlogDto } from '../dto';

export class CreateBlogCommand extends Command<string> {
  constructor(public readonly dto: CreateBlogDto) {
    super();
  }
}

export class CreateBlogUseCase implements ICommandHandler<
  CreateBlogCommand,
  string
> {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<string> {
    const newBlog = this.BlogModel.createBlog(dto);

    await this.blogsRepository.save(newBlog);

    return newBlog._id.toString();
  }
}
