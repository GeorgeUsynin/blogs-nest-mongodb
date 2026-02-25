import { BaseQueryParamsInputDto } from '../../../../../core/dto';
import { UserSortByFields } from './users-sort-by-fields';

export class GetUsersQueryParamsInputDto extends BaseQueryParamsInputDto {
  sortBy: UserSortByFields = UserSortByFields.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
