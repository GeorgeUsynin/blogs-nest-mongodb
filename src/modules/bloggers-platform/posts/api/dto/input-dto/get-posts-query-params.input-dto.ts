import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { PostSortByFields } from './posts-sort-by-fields';

export class GetPostsQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: PostSortByFields,
    required: false,
    default: PostSortByFields.CreatedAt,
  })
  sortBy: PostSortByFields = PostSortByFields.CreatedAt;
}
