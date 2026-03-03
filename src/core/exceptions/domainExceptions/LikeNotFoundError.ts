import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class LikeNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.LIKE_NOT_FOUND);
  }
}
