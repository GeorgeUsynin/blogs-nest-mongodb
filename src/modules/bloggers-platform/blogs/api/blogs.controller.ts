import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application';
import { PostsService } from '../../posts/application';
import { BlogsQueryRepository } from '../infrastructure';
import { PostsQueryRepository } from '../../posts/infrastructure';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  BlogViewDto,
  CreateBlogInputDto,
  CreatePostWithoutBlogIdInputDto,
  GetBlogsQueryParamsInputDto,
  UpdateBlogInputDto,
} from './dto';
import { GetPostsQueryParamsInputDto, PostViewDto } from '../../posts/api/dto';
import {
  CreateBlogApi,
  CreatePostByBlogIdApi,
  DeleteBlogApi,
  GetAllBlogsApi,
  GetAllPostsByBlogIdApi,
  GetBlogApi,
  UpdateBlogApi,
} from './swagger';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsService: BlogsService,
    private postsService: PostsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllBlogsApi()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParamsInputDto,
  ): Promise<PaginatedViewDto<BlogViewDto>> {
    const { items, totalCount } =
      await this.blogsQueryRepository.getAllBlogs(query);

    const mappedItems = items.map(BlogViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetBlogApi()
  async getBlogById(@Param('id') id: string): Promise<BlogViewDto> {
    const foundBlog = await this.blogsQueryRepository.getBlogById(id);

    if (!foundBlog) {
      // throw new BlogNotFoundError();
      throw new Error();
    }

    return BlogViewDto.mapToView(foundBlog);
  }

  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  @GetAllPostsByBlogIdApi()
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParamsInputDto,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      // throw new BlogNotFoundError();
      throw new Error();
    }

    const { items, totalCount } =
      await this.postsQueryRepository.getAllPostsByBlogId(blogId, query);

    const mappedItems = items.map(PostViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateBlogApi()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(body);

    const createdBlog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!createdBlog) {
      // throw new BlogCreationFailedError();
      throw new Error();
    }

    return BlogViewDto.mapToView(createdBlog);
  }

  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  @CreatePostByBlogIdApi()
  async createPostForBlogByBlogId(
    @Param('blogId') blogId: string,
    @Body() body: CreatePostWithoutBlogIdInputDto,
  ) {
    const postId = await this.postsService.createPost({ ...body, blogId });

    const createdPost = await this.postsQueryRepository.getPostById(postId);

    if (!createdPost) {
      // throw new PostCreationFailedError();
      throw new Error();
    }

    return PostViewDto.mapToView(createdPost);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateBlogApi()
  async updateBlogById(
    @Param('id') id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    await this.blogsService.updateById({ ...body, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteBlogApi()
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }
}
