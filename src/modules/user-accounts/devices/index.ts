import {
  TerminateAllDevicesExceptCurrentUseCase,
  TerminateDeviceByDeviceIdUseCase,
} from './application/use-cases';
import { DevicesQueryRepository, DevicesRepository } from './infrastructure';

export { Device, DeviceSchema } from './domain';
export { DevicesController } from './api';

export const devicesProviders = [DevicesRepository, DevicesQueryRepository];

export const devicesUseCases = [
  TerminateAllDevicesExceptCurrentUseCase,
  TerminateDeviceByDeviceIdUseCase,
];
