import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter } from 'mongoose';
import { Blog, BlogDocument, type BlogModelType } from '../../domain';
import { GetBlogsQueryParamsInputDto } from '../../api/dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async getAllBlogs(
    query: GetBlogsQueryParamsInputDto,
  ): Promise<{ items: BlogDocument[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, searchNameTerm } = query;

    const filter: QueryFilter<BlogDocument> = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const [items, totalCount] = await Promise.all([
      this.BlogModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(query.calculateSkip())
        .limit(pageSize)
        .lean()
        .exec(),
      this.BlogModel.countDocuments(filter).exec(),
    ]);

    return { items, totalCount };
  }

  async getBlogById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findById(id).lean().exec();
  }
}
