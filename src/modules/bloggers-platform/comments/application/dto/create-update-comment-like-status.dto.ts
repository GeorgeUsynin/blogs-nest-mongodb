import { LikeStatus } from '../../../likes/domain';

export class CreateUpdateCommentLikeStatusDto {
  commentId: string;
  userId: string;
  likeStatus: LikeStatus;
}
