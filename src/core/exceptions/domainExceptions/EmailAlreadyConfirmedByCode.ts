import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class EmailAlreadyConfirmedByCode extends BaseDomainException {
  constructor() {
    super(ErrorCodes.EMAIL_ALREADY_CONFIRMED_BY_CODE, ErrorFields.CODE);
  }
}
