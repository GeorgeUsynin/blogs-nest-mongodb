import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../../core/decorators';
import { PostViewDto } from '../dto';

export const GetAllPostsApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns posts with paging' }),
    ApiPaginatedResponse(PostViewDto),
  );
};
