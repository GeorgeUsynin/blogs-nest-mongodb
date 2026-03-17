import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateDeviceDomainDto } from './dto';
import { NotAnOwnerOfThisDevice } from '../../../../core/exceptions';

export class Device {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  issuedAt: string;

  @Prop({ type: String, required: true })
  deviceName: string;

  @Prop({ type: String, required: true })
  clientIp: string;

  @Prop({ type: String, required: true })
  expiresIn: string;

  static createDevice(dto: CreateDeviceDomainDto): DeviceDocument {
    // device -> DeviceDocument
    // this -> DeviceModel
    const device = new this();

    device.userId = dto.userId;
    device.deviceId = dto.deviceId;
    device.issuedAt = dto.issuedAt;
    device.deviceName = dto.deviceName;
    device.clientIp = dto.clientIp;
    device.expiresIn = dto.expiresIn;

    return device as DeviceDocument;
  }

  isDeviceOwner(userId: string) {
    return this.userId === userId;
  }

  isIssuedAtMatch(dateISO: string) {
    return this.issuedAt === dateISO;
  }

  ensureDeviceOwner(userId: string) {
    if (this.userId !== userId) {
      throw new NotAnOwnerOfThisDevice();
    }

    return true;
  }

  updateDeviceAttributes(issuedAt: string, expiresIn: string) {
    this.issuedAt = issuedAt;
    this.expiresIn = expiresIn;
  }
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

// Registers the entity methods in the schema
DeviceSchema.loadClass(Device);

// Type of the document
export type DeviceDocument = HydratedDocument<Device>;

// Type of the model + static methods
export type DeviceModelType = Model<DeviceDocument> & typeof Device;
