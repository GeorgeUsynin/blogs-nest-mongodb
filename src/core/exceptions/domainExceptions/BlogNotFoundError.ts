import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class BlogNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.BLOG_NOT_FOUND);
  }
}
