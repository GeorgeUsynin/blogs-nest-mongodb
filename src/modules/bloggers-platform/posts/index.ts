export { PostsController } from './api';
export { Post, PostSchema } from './domain';
import {
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateUpdatePostLikeStatusUseCase,
} from './application/use-cases';
import { PostsRepository, PostsQueryRepository } from './infrastructure';

const postsUseCases = [
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateUpdatePostLikeStatusUseCase,
];

export const postsProviders = [
  PostsRepository,
  PostsQueryRepository,
  ...postsUseCases,
];
