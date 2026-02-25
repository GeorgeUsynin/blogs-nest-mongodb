import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/core/decorators';
import { BlogViewDto } from '../dto';

export const GetAllBlogsApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns blogs with paging' }),
    ApiPaginatedResponse(BlogViewDto),
  );
};
