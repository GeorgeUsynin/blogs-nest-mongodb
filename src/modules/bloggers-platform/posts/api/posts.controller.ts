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
import { PostsService } from '../application';
import { CommentsService } from '../../comments/application';
import { PostsQueryRepository } from '../infrastructure';
import { CommentsQueryRepository } from '../../comments/infrastructure';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  PostViewDto,
  CreatePostInputDto,
  GetPostsQueryParamsInputDto,
  UpdatePostInputDto,
} from './dto';
import {
  CommentViewDto,
  CreateCommentInputDto,
  GetCommentsQueryParamsInputDto,
} from '../../comments/api/dto';
import {
  GetAllPostsApi,
  GetPostApi,
  GetAllCommentsByPostIdApi,
  CreatePostApi,
  DeletePostApi,
  UpdatePostApi,
  CreateCommentByPostIdApi,
} from './swagger';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllPostsApi()
  async getAllPosts(
    @Query() query: GetPostsQueryParamsInputDto,
  ): Promise<PaginatedViewDto<PostViewDto>> {
    const { items, totalCount } =
      await this.postsQueryRepository.getAllPosts(query);

    const mappedItems = items.map(PostViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetPostApi()
  async getPostById(@Param('id') id: string): Promise<PostViewDto> {
    const foundPost = await this.postsQueryRepository.getPostById(id);

    if (!foundPost) {
      // throw new PostNotFoundError();
      throw new Error();
    }

    return PostViewDto.mapToView(foundPost);
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @GetAllCommentsByPostIdApi()
  async getAllCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: GetCommentsQueryParamsInputDto,
  ) {
    const foundPost = await this.postsQueryRepository.getPostById(postId);
    if (!foundPost) {
      // throw new PostNotFoundError();
      throw new Error();
    }

    const { items, totalCount } =
      await this.commentsQueryRepository.getAllCommentsByPostId(
        postId,
        query,
        '',
      );

    const mappedItems = items.map(CommentViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreatePostApi()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.createPost(body);

    const createdPost = await this.postsQueryRepository.getPostById(postId);

    if (!createdPost) {
      // throw new PostCreationFailedError();
      throw new Error();
    }

    return PostViewDto.mapToView(createdPost);
  }

  @Post('/:postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @CreateCommentByPostIdApi()
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() body: CreateCommentInputDto,
  ) {
    const commentId = await this.commentsService.createComment(
      postId,
      '',
      body,
    );

    const createdComment =
      await this.commentsQueryRepository.getCommentById(commentId);

    if (!createdComment) {
      // throw new CommentCreationFailedError();
      throw new Error();
    }

    return CommentViewDto.mapToView(createdComment);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApi()
  async updatePostById(
    @Param('id') id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    await this.postsService.updateById({ ...body, id });
  }

  @Delete(':id')
  @DeletePostApi()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(id);
  }
}
