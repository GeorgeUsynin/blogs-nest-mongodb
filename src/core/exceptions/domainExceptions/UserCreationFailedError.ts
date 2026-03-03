import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class UserCreationFailedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.USER_CREATION_FAILED);
  }
}
