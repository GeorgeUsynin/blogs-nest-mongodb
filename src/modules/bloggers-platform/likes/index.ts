export { Like, LikeSchema } from './domain';
import { LikesService } from './application';
import { LikesRepository, LikesQueryRepository } from './infrastructure';

export const likesProviders = [
  LikesService,
  LikesRepository,
  LikesQueryRepository,
];
