import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class ConfirmationCodeExpired extends BaseDomainException {
  constructor() {
    super(ErrorCodes.CONFIRMATION_CODE_EXPIRED, ErrorFields.CODE);
  }
}
