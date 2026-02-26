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

const controllers = [BlogsController, PostsController, CommentsController];
const providers = [...blogsProviders, ...postsProviders, ...commentsProviders];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [...controllers],
  providers: [...providers],
})
export class BloggersPlatformModule {}
