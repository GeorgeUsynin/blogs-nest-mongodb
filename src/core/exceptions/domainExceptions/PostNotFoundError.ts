import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class PostNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.POST_NOT_FOUND);
  }
}
