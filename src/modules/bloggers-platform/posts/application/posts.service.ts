import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from '../infrastructure';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post, type PostModelType } from '../domain';
import { UpdatePostDomainDto } from '../domain/dto';
import { BlogsRepository } from '../../blogs/infrastructure';
import {
  BlogNotFoundError,
  PostNotFoundError,
} from '../../../../core/exceptions';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.findBlogByIdOrThrowNotFound(dto.blogId);

    const newPost = this.PostModel.createPost({ ...dto, blogName: blog.name });

    await this.postsRepository.save(newPost);

    return newPost._id.toString();
  }

  async updateById(dto: UpdatePostDto) {
    await this.findBlogByIdOrThrowNotFound(dto.blogId);

    const foundPost = await this.findPostByIdOrThrowNotFound(dto.id);

    const updatePostDomainDto: UpdatePostDomainDto = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    };

    foundPost.updatePost(updatePostDomainDto);

    await this.postsRepository.save(foundPost);
  }

  async deletePost(id: string): Promise<void> {
    const foundPost = await this.findPostByIdOrThrowNotFound(id);

    foundPost.makeDeleted();

    await this.postsRepository.save(foundPost);
  }

  private async findBlogByIdOrThrowNotFound(id: string) {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) throw new BlogNotFoundError();
    return blog;
  }

  private async findPostByIdOrThrowNotFound(id: string) {
    const post = await this.postsRepository.findById(id);
    if (!post) throw new PostNotFoundError();
    return post;
  }
}
