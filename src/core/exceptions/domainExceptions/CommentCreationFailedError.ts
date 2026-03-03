import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class CommentCreationFailedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.COMMENT_CREATION_FAILED);
  }
}
