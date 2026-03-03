import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { PostSortByFields } from './posts-sort-by-fields';
import { IsEnum } from 'class-validator';

export class GetPostsQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: PostSortByFields,
    required: false,
    default: PostSortByFields.CreatedAt,
  })
  @IsEnum(PostSortByFields)
  sortBy: PostSortByFields = PostSortByFields.CreatedAt;
}
