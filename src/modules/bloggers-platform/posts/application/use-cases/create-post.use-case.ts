import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto';
import { BlogNotFoundError } from '../../../../../core/exceptions';
import { Post, type PostModelType } from '../../domain';
import { BlogsRepository } from '../../../blogs/infrastructure';
import { PostsRepository } from '../../infrastructure';

export class CreatePostCommand extends Command<string> {
  constructor(public readonly dto: CreatePostDto) {
    super();
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<
  CreatePostCommand,
  string
> {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) {
      throw new BlogNotFoundError();
    }

    const newPost = this.PostModel.createPost({ ...dto, blogName: blog.name });

    await this.postsRepository.save(newPost);

    return newPost._id.toString();
  }
}
