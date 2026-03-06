import { LikeStatus } from '../../../../likes/domain';
import { Post } from '../../../domain';

export type TNewestLike = {
  createdAt: Date;
  authorId: string;
  authorLogin: string;
};

export type PostReadDto = OnlyProperties<WithId<Post>> & {
  myStatus: LikeStatus;
  newestLikes: TNewestLike[];
};
