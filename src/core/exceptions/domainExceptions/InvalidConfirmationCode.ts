import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class InvalidConfirmationCode extends BaseDomainException {
  constructor() {
    super(ErrorCodes.INVALID_CONFIRMATION_CODE, ErrorFields.CODE);
  }
}
