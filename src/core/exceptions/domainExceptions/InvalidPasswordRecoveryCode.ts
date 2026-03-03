import { ErrorCodes, ErrorFields } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class InvalidPasswordRecoveryCode extends BaseDomainException {
  constructor() {
    super(ErrorCodes.INVALID_PASSWORD_RECOVERY_CODE, ErrorFields.RECOVERY_CODE);
  }
}
