import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class PostAlreadyDeleted extends BaseDomainException {
  constructor() {
    super(ErrorCodes.POST_ALREADY_DELETED);
  }
}
