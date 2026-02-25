export class PaginatedViewDto<T> {
  items: T[];
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;

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
