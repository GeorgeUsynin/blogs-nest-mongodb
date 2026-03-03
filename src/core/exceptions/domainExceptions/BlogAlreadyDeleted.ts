import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class BlogAlreadyDeleted extends BaseDomainException {
  constructor() {
    super(ErrorCodes.BLOG_ALREADY_DELETED);
  }
}
