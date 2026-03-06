import { LikeStatus } from '../../../likes/domain';

export class CreateUpdatePostLikeStatusDto {
  postId: string;
  userId: string;
  likeStatus: LikeStatus;
}
