import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsService } from '../application';
import { CommentsQueryRepository } from '../infrastructure';
import { CommentViewDto, UpdateCommentInputDto } from './dto';
import { DeleteCommentApi, GetCommentApi, UpdateCommentApi } from './swagger';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetCommentApi()
  async getCommentById(@Param('id') id: string): Promise<CommentViewDto> {
    const foundComment = await this.commentsQueryRepository.getCommentById(id);

    if (!foundComment) {
      // throw new CommentNotFoundError();
      throw new Error();
    }

    return CommentViewDto.mapToView(foundComment);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateCommentApi()
  async updateCommentById(
    @Param('id') id: string,
    @Body() body: UpdateCommentInputDto,
  ): Promise<void> {
    await this.commentsService.updateById('', { ...body, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteCommentApi()
  async deleteComment(@Param('id') id: string): Promise<void> {
    await this.commentsService.deleteComment(id, '');
  }
}
