import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeviceViewDto } from '../dto';

export const GetAllAuthSessionDevicesApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns all devices with active sessions for current user',
    }),
    ApiOkResponse({
      type: DeviceViewDto,
      isArray: true,
      description: 'Success',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
