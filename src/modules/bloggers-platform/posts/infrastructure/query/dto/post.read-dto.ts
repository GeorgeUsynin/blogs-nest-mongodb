import { LikeStatus } from '../../../../likes/domain';
import { Post } from '../../../domain';

type TNewestLikes = {
  createdAt: Date;
  authorId: string;
  authorLogin: string;
};

export type PostReadDto = OnlyProperties<WithId<Post>> & {
  myStatus: LikeStatus;
  newestLikes: TNewestLikes[];
};
