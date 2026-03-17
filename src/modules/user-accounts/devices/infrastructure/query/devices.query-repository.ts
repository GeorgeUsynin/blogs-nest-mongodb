import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, type DeviceModelType, DeviceDocument } from '../../domain';

type FindDevicesFilter = Partial<Pick<DeviceDocument, 'userId'>>;

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: DeviceModelType,
  ) {}

  async getAllByUserId(userId: string): Promise<DeviceDocument[]> {
    return this.getAllByFilter({ userId });
  }

  async getAllByFilter(
    filter: FindDevicesFilter = {},
  ): Promise<DeviceDocument[]> {
    const items = await this.DeviceModel.find(filter).lean().exec();

    return items;
  }
}
