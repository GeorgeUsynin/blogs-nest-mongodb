import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtCookiesAuthGuard } from '../../users/guards/bearer';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserContextWithDeviceIdDto } from '../../users/guards/dto';
import { ExtractUserFromRequest } from '../../users/guards/decorators';
import { DevicesQueryRepository } from '../infrastructure';
import { DeviceViewDto } from './dto';
import {
  GetAllAuthSessionDevicesApi,
  TerminateAuthDeviceSessionByIdApi,
  TerminateAuthDeviceSessionExceptCurrentApi,
} from './swagger';
import {
  TerminateAllDevicesExceptCurrentCommand,
  TerminateDeviceByDeviceIdCommand,
} from '../application/use-cases';

@ApiBearerAuth()
@UseGuards(JwtCookiesAuthGuard)
@Controller('security/devices')
export class DevicesController {
  constructor(
    private devicesQueryRepository: DevicesQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllAuthSessionDevicesApi()
  async getAllDevices(
    @ExtractUserFromRequest() user: UserContextWithDeviceIdDto,
  ): Promise<DeviceViewDto[]> {
    const devices = await this.devicesQueryRepository.getAllByUserId(
      user.userId,
    );

    return devices.map(DeviceViewDto.mapToView);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @TerminateAuthDeviceSessionExceptCurrentApi()
  async deleteAllDevicesExceptCurrent(
    @ExtractUserFromRequest() user: UserContextWithDeviceIdDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new TerminateAllDevicesExceptCurrentCommand(user.deviceId, user.userId),
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @TerminateAuthDeviceSessionByIdApi()
  async deleteDeviceById(
    @ExtractUserFromRequest() user: UserContextWithDeviceIdDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new TerminateDeviceByDeviceIdCommand(user.deviceId, user.userId),
    );
  }
}
