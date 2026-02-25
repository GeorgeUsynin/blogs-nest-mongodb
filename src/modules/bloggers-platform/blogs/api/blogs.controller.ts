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
import { BlogsQueryRepository } from '../infrastructure';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  BlogViewDto,
  CreateBlogInputDto,
  GetBlogsQueryParamsInputDto,
  UpdateBlogInputDto,
} from './dto';
import {
  CreateBlogApi,
  DeleteBlogApi,
  GetAllBlogsApi,
  GetBlogApi,
  UpdateBlogApi,
} from './swagger';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsService: BlogsService,
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
