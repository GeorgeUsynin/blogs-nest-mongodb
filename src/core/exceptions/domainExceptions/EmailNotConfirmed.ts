import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class EmailNotConfirmedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.EMAIL_NOT_CONFIRMED);
  }
}
