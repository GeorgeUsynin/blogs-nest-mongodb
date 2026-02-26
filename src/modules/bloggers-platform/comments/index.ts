export { CommentsController } from './api';
export { Comment, CommentSchema } from './domain';
import { CommentsService } from './application';
import { CommentsRepository, CommentsQueryRepository } from './infrastructure';

export const commentsProviders = [
  CommentsService,
  CommentsRepository,
  CommentsQueryRepository,
];
