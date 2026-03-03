import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class NotAnOwnerOfThisDevice extends BaseDomainException {
  constructor() {
    super(ErrorCodes.NOT_AN_OWNER_OF_THIS_DEVICE);
  }
}
