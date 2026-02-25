import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class BaseQueryParamsInputDto {
  @ApiProperty({
    required: false,
    description: 'pageNumber is number of portions that should be returned',
    default: 1,
  })
  @Type(() => Number)
  pageNumber: number = 1;

  @ApiProperty({
    required: false,
    description: 'pageSize is portions size that should be returned',
    default: 10,
  })
  @Type(() => Number)
  pageSize: number = 10;

  @ApiProperty({
    enum: SortDirection,
    required: false,
    default: SortDirection.Desc,
  })
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
