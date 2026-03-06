import { LikeStatus, ParentType } from '../../domain';

export class SetLikeStatusDto {
  likeStatus: LikeStatus;
  parentId: string;
  parentType: ParentType;
  authorId: string;
}
