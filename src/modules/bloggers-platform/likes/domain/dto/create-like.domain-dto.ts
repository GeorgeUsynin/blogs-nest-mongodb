import { NonNoneLikeStatus, ParentType } from '../types';

export class CreateLikeDomainDto {
  authorId: string;
  parentId: string;
  parentType: ParentType;
  likeStatus: NonNoneLikeStatus;
}
