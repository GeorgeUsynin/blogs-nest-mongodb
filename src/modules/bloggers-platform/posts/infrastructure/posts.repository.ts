import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, type PostModelType } from '../domain';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findById(id);
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }
}
