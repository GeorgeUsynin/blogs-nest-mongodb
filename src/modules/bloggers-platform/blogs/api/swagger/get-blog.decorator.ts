import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { BlogViewDto } from '../dto';

export const GetBlogApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns blog by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'Existing blog id' }),
    ApiOkResponse({
      description: 'Success',
      type: BlogViewDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
