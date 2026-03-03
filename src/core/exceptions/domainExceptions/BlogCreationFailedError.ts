import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class BlogCreationFailedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.BLOG_CREATION_FAILED);
  }
}
