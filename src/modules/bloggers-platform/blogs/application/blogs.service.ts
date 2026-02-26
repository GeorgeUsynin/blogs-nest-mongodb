import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../infrastructure';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { Blog, type BlogModelType } from '../domain';
import { UpdateBlogDomainDto } from '../domain/dto';

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
    const foundBlog = await this.blogsRepository.findById(dto.id);

    if (!foundBlog) {
      // throw new BlogNotFoundError()
      throw new Error();
    }

    const updateBlogDomainDto: UpdateBlogDomainDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };

    foundBlog.updateBlog(updateBlogDomainDto);

    await this.blogsRepository.save(foundBlog);
  }

  async deleteBlog(id: string): Promise<void> {
    const foundBlog = await this.blogsRepository.findById(id);

    if (!foundBlog) {
      // throw new BlogNotFoundError();
      throw new Error();
    }

    foundBlog.makeDeleted();

    await this.blogsRepository.save(foundBlog);
  }
}
