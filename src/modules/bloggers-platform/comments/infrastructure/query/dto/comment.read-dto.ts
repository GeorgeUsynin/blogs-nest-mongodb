import { LikeStatus } from '../../../../likes/domain';
import { Comment } from '../../../domain';

export type CommentReadDto = OnlyProperties<WithId<Comment>> & {
  myStatus: LikeStatus;
};
