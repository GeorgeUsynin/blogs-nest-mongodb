export { PostsController } from './api';
export { Post, PostSchema } from './domain';
import { PostsService } from './application';
import { PostsRepository, PostsQueryRepository } from './infrastructure';

export const postsProviders = [
  PostsService,
  PostsRepository,
  PostsQueryRepository,
];
