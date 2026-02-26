import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema, BlogsController, blogsProviders } from './blogs';
import { Post, PostSchema, PostsController, postsProviders } from './posts';

const controllers = [BlogsController, PostsController];
const providers = [...blogsProviders, ...postsProviders];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [...controllers],
  providers: [...providers],
})
export class BloggersPlatformModule {}
