export { BlogsController } from './api';
export { Blog, BlogSchema } from './domain';
import {
  CreateBlogUseCase,
  UpdateBlogCommand,
  DeleteBlogCommand,
} from './application/use-cases';
import { BlogsRepository, BlogsQueryRepository } from './infrastructure';

const blogsUseCases = [CreateBlogUseCase, UpdateBlogCommand, DeleteBlogCommand];

export const blogsProviders = [
  BlogsRepository,
  BlogsQueryRepository,
  ...blogsUseCases,
];
