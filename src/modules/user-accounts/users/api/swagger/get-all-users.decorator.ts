import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserViewDto } from '../dto';
import { ApiPaginatedResponse } from '../../../../../core/decorators';

export const GetAllUsersApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns users with paging' }),
    ApiPaginatedResponse(UserViewDto),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
