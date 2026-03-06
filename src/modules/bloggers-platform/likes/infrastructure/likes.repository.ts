import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Like,
  LikeDocument,
  LikeStatus,
  ParentType,
  type LikeModelType,
} from '../domain';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
  ) {}
  async findById(id: string): Promise<LikeDocument | null> {
    return this.LikeModel.findById(id);
  }

  async findByParentAndAuthor(
    parentId: string,
    parentType: ParentType,
    authorId: string,
  ): Promise<LikeDocument | null> {
    return this.LikeModel.findOne({ parentId, authorId, parentType });
  }

  async countByParentAndStatus(
    parentId: string,
    parentType: ParentType,
    likeStatus: LikeStatus,
  ): Promise<number> {
    return this.LikeModel.countDocuments({ parentId, parentType, likeStatus });
  }

  async removeById(id: string): Promise<void> {
    await this.LikeModel.findByIdAndDelete(id);
  }

  async save(like: LikeDocument): Promise<void> {
    await like.save();
  }
}
