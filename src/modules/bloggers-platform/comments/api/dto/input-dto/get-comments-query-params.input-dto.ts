import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { CommentSortByFields } from './comment-sort-by-fields';

export class GetCommentsQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: CommentSortByFields,
    required: false,
    default: CommentSortByFields.CreatedAt,
  })
  sortBy: CommentSortByFields = CommentSortByFields.CreatedAt;
}
