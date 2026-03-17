import { InjectModel } from '@nestjs/mongoose';
import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { User, type UserModelType } from '../user-accounts/users/domain';
import { Blog, type BlogModelType } from '../bloggers-platform/blogs/domain';
import { Post, type PostModelType } from '../bloggers-platform/posts/domain';
import { Like, type LikeModelType } from '../bloggers-platform/likes/domain';
import { Device, type DeviceModelType } from '../user-accounts/devices/domain';
import {
  Comment,
  type CommentModelType,
} from '../bloggers-platform/comments/domain';

import { TestingAllDataApi } from './swagger/testing-all-data.decorator';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    @InjectModel(Device.name)
    private DeviceModel: DeviceModelType,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    await this.UserModel.deleteMany();
    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.LikeModel.deleteMany();
    await this.CommentModel.deleteMany();
    await this.DeviceModel.deleteMany();
  }
}
