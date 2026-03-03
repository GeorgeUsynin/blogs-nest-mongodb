import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class LoginAlreadyExistsError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.LOGIN_ALREADY_EXISTS, ErrorFields.LOGIN);
  }
}
