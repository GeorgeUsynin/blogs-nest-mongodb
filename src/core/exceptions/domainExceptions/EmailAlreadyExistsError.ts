import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class EmailAlreadyExistsError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.EMAIL_ALREADY_EXISTS, ErrorFields.EMAIL);
  }
}
