import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { BlogSortByFields } from './blogs-sort-by-fields';

export class GetBlogsQueryParamsInputDto extends BaseQueryParamsInputDto {
  sortBy: BlogSortByFields = BlogSortByFields.CreatedAt;
  searchNameTerm: string | null = null;
}
