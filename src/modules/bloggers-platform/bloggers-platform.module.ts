import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
  BlogsController,
  BlogsQueryRepository,
  BlogsRepository,
  BlogsService,
} from './blogs';

const controllers = [BlogsController];
const providers = [BlogsService, BlogsRepository, BlogsQueryRepository];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [...controllers],
  providers: [...providers],
})
export class BloggersPlatformModule {}
