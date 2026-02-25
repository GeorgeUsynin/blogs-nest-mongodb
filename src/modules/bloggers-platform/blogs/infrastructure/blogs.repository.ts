import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, type BlogModelType } from '../domain';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findById(id);
  }

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
  }
}
