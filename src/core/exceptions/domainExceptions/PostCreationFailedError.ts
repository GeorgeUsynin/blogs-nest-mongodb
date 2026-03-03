import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class PostCreationFailedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.POST_CREATION_FAILED);
  }
}
