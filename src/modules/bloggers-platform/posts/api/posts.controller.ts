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
import { ObjectIdValidationPipe } from '../../../../core/pipes';
import {
  CommentCreationFailedError,
  PostCreationFailedError,
  PostNotFoundError,
} from '../../../../core/exceptions';
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
  async getPostById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<PostViewDto> {
    const foundPost = await this.findPostByIdOrThrowNotFound(id);

    return PostViewDto.mapToView(foundPost);
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @GetAllCommentsByPostIdApi()
  async getAllCommentsByPostId(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Query() query: GetCommentsQueryParamsInputDto,
  ) {
    await this.findPostByIdOrThrowNotFound(postId);

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
      throw new PostCreationFailedError();
    }

    return PostViewDto.mapToView(createdPost);
  }

  @Post('/:postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @CreateCommentByPostIdApi()
  async createCommentByPostId(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() body: CreateCommentInputDto,
  ) {
    const commentId = await this.commentsService.createComment(
      postId,
      'userId',
      body,
    );

    const createdComment =
      await this.commentsQueryRepository.getCommentById(commentId);

    if (!createdComment) {
      throw new CommentCreationFailedError();
    }

    return CommentViewDto.mapToView(createdComment);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApi()
  async updatePostById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    await this.postsService.updateById({ ...body, id });
  }

  @Delete(':id')
  @DeletePostApi()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    await this.postsService.deletePost(id);
  }

  private async findPostByIdOrThrowNotFound(id: string) {
    const post = await this.postsQueryRepository.getPostById(id);
    if (!post) throw new PostNotFoundError();
    return post;
  }
}
