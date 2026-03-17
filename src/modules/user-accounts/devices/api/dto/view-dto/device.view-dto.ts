import { ApiProperty } from '@nestjs/swagger';
import { DeviceDocument } from '../../../domain';

export class DeviceViewDto {
  @ApiProperty()
  ip: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  lastActiveDate: string;

  @ApiProperty()
  deviceId: string;

  public static mapToView(device: DeviceDocument): DeviceViewDto {
    const dto = new DeviceViewDto();

    dto.ip = device.clientIp;
    dto.title = device.deviceName;
    dto.lastActiveDate = device.issuedAt;
    dto.deviceId = device.deviceId;

    return dto;
  }
}
