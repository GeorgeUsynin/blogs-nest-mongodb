import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class UserAlreadyDeleted extends BaseDomainException {
  constructor() {
    super(ErrorCodes.USER_ALREADY_DELETED);
  }
}
