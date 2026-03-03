import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class CommentNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.COMMENT_NOT_FOUND);
  }
}
