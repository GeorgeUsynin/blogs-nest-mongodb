import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class UserNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.USER_NOT_FOUND);
  }
}
