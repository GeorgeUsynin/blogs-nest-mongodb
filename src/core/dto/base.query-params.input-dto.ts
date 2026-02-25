import { Type } from 'class-transformer';

enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class BaseQueryParamsInputDto {
  @Type(() => Number)
  pageNumber: number = 1;

  @Type(() => Number)
  pageSize: number = 10;

  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
