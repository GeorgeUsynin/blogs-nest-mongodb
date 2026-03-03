import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { CommentSortByFields } from './comment-sort-by-fields';
import { IsEnum } from 'class-validator';

export class GetCommentsQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: CommentSortByFields,
    required: false,
    default: CommentSortByFields.CreatedAt,
  })
  @IsEnum(CommentSortByFields)
  sortBy: CommentSortByFields = CommentSortByFields.CreatedAt;
}
