import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema, BlogsController, blogsProviders } from './blogs';
import { Post, PostSchema, PostsController, postsProviders } from './posts';
import {
  Comment,
  CommentSchema,
  CommentsController,
  commentsProviders,
} from './comments';
import { Like, LikeSchema, likesProviders } from './likes';
import { UserAccountsModule } from '../user-accounts';

const controllers = [BlogsController, PostsController, CommentsController];
const providers = [
  ...blogsProviders,
  ...postsProviders,
  ...commentsProviders,
  ...likesProviders,
];
const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Like.name, schema: LikeSchema },
];

@Module({
  imports: [MongooseModule.forFeature(mongooseModels), UserAccountsModule],
  controllers: [...controllers],
  providers: [...providers],
  exports: [MongooseModule],
})
export class BloggersPlatformModule {}
