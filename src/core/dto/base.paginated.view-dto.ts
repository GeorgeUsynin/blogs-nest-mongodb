import { ApiProperty } from '@nestjs/swagger';

export class PaginatedViewDto<T> {
  @ApiProperty()
  pagesCount: number;
  @ApiProperty({ example: 1 })
  page: number;
  @ApiProperty({ example: 10 })
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  items: T[];

  static mapToView<T>(data: {
    items: T[];
    page: number;
    size: number;
    totalCount: number;
  }): PaginatedViewDto<T> {
    const dto = new PaginatedViewDto<T>();

    dto.totalCount = data.totalCount;
    dto.pagesCount = Math.ceil(data.totalCount / data.size);
    dto.page = data.page;
    dto.pageSize = data.size;
    dto.items = data.items;

    return dto;
  }
}
