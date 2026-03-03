import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class PasswordRecoveryCodeExpired extends BaseDomainException {
  constructor() {
    super(ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED, ErrorFields.RECOVERY_CODE);
  }
}
