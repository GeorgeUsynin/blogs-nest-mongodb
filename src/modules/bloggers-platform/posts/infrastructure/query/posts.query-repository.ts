import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, type PostModelType } from '../../domain';
import { GetPostsQueryParamsInputDto } from '../../api/dto';
import { PostReadDto } from './dto';
import { LikeStatus } from '../../../likes/domain';

type FindPostsFilter = Partial<Pick<PostDocument, 'blogId'>>;

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParamsInputDto,
    userId?: string,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, {});
  }

  async getAllPostsByBlogId(
    blogId: string,
    query: GetPostsQueryParamsInputDto,
    userId?: string,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, { blogId });
  }

  async findManyWithFilter(
    query: GetPostsQueryParamsInputDto,
    filter: FindPostsFilter = {},
    userId?: string,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize } = query;

    const [items, totalCount] = await Promise.all([
      this.PostModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(query.calculateSkip())
        .limit(pageSize)
        .lean()
        .exec(),
      this.PostModel.countDocuments(filter).exec(),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        myStatus: LikeStatus.None,
        newestLikes: [],
      })),
      totalCount,
    };
  }

  async getPostById(id: string): Promise<PostReadDto | null> {
    const post = await this.PostModel.findById(id).lean().exec();

    if (!post) return null;

    return { ...post, myStatus: LikeStatus.None, newestLikes: [] };
  }
}
