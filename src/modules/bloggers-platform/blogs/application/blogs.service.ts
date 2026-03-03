import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../infrastructure';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { Blog, type BlogModelType } from '../domain';
import { UpdateBlogDomainDto } from '../domain/dto';
import { BlogNotFoundError } from '../../../../core/exceptions';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const newBlog = this.BlogModel.createBlog(dto);

    await this.blogsRepository.save(newBlog);

    return newBlog._id.toString();
  }

  async updateById(dto: UpdateBlogDto) {
    const foundBlog = await this.findBlogByIdOrThrowNotFound(dto.id);

    const updateBlogDomainDto: UpdateBlogDomainDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };

    foundBlog.updateBlog(updateBlogDomainDto);

    await this.blogsRepository.save(foundBlog);
  }

  async deleteBlog(id: string): Promise<void> {
    const foundBlog = await this.findBlogByIdOrThrowNotFound(id);

    foundBlog.makeDeleted();

    await this.blogsRepository.save(foundBlog);
  }

  private async findBlogByIdOrThrowNotFound(id: string) {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) throw new BlogNotFoundError();
    return blog;
  }
}
