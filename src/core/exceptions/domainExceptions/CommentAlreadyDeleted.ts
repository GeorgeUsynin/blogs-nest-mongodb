import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class CommentAlreadyDeleted extends BaseDomainException {
  constructor() {
    super(ErrorCodes.COMMENT_ALREADY_DELETED);
  }
}
