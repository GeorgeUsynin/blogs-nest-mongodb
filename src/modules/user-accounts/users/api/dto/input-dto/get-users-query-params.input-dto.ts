import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { UserSortByFields } from './users-sort-by-fields';

export class GetUsersQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: UserSortByFields,
    required: false,
    default: UserSortByFields.CreatedAt,
  })
  sortBy: UserSortByFields = UserSortByFields.CreatedAt;

  @ApiProperty({
    type: String,
    description:
      'Search term for user Login: Login should contains this term in any position',
    required: false,
  })
  searchLoginTerm: string | null = null;

  @ApiProperty({
    type: String,
    description:
      'Search term for user Email: Email should contains this term in any position',
    required: false,
  })
  searchEmailTerm: string | null = null;
}
