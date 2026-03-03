import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class DeviceNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.DEVICE_NOT_FOUND);
  }
}
