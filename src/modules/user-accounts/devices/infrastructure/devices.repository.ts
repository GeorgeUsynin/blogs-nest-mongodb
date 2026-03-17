import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, type DeviceModelType, DeviceDocument } from '../domain';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: DeviceModelType,
  ) {}

  async findByDeviceId(id: string): Promise<DeviceDocument | null> {
    return this.DeviceModel.findOne({ deviceId: id });
  }

  async removeByDeviceId(id: string): Promise<void> {
    await this.DeviceModel.deleteOne({ deviceId: id });
  }

  async removeAllDevicesExceptCurrent(
    deviceId: string,
    userId: string,
  ): Promise<void> {
    await this.DeviceModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
  }

  async save(device: DeviceDocument): Promise<void> {
    await device.save();
  }
}
