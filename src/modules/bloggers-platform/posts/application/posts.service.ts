import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from '../infrastructure';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post, type PostModelType } from '../domain';
import { UpdatePostDomainDto } from '../domain/dto';
import { BlogsRepository } from '../../blogs/infrastructure';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId);

    if (!blog) {
      // throw new BlogNotFoundError();
      throw new Error();
    }

    const newPost = this.PostModel.createPost({ ...dto, blogName: blog.name });

    await this.postsRepository.save(newPost);

    return newPost._id.toString();
  }

  async updateById(dto: UpdatePostDto) {
    const foundPost = await this.postsRepository.findById(dto.id);

    if (!foundPost) {
      // throw new PostNotFoundError()
      throw new Error();
    }

    const updatePostDomainDto: UpdatePostDomainDto = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    };

    foundPost.update(updatePostDomainDto);

    await this.postsRepository.save(foundPost);
  }

  async deletePost(id: string): Promise<void> {
    const foundPost = await this.postsRepository.findById(id);

    if (!foundPost) {
      // throw new PostNotFoundError();
      throw new Error();
    }

    foundPost.makeDeleted();

    await this.postsRepository.save(foundPost);
  }
}
