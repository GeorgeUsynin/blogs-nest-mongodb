import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../infrastructure';
import { Like, type LikeModelType, LikeStatus, ParentType } from '../domain';
import { SetLikeStatusDto } from './dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    private likesRepository: LikesRepository,
  ) {}

  async setLikeStatus(dto: SetLikeStatusDto): Promise<void> {
    const { authorId, parentId, likeStatus, parentType } = dto;

    const foundLike = await this.likesRepository.findByParentAndAuthor(
      parentId,
      parentType,
      authorId,
    );

    if (!foundLike) {
      // not allowing like creation with None status
      if (likeStatus === LikeStatus.None) return;

      const newLike = this.LikeModel.createLike({
        authorId,
        parentId,
        likeStatus,
        parentType,
      });
      await this.likesRepository.save(newLike);
    } else {
      // if likeStatus is the same -> exit
      if (foundLike.isSameLikeStatus(likeStatus)) return;

      switch (likeStatus) {
        case LikeStatus.None:
          await this.likesRepository.removeById(foundLike._id.toString());
          break;
        case LikeStatus.Like:
        case LikeStatus.Dislike:
          foundLike.updateLikeStatus(likeStatus);
          await this.likesRepository.save(foundLike);
          break;
      }
    }
  }

  async getLikesCounts(
    parentId: string,
    parentType: ParentType,
  ): Promise<{
    likesCount: number;
    dislikesCount: number;
  }> {
    const [likesCount, dislikesCount] = await Promise.all([
      this.likesRepository.countByParentAndStatus(
        parentId,
        parentType,
        LikeStatus.Like,
      ),
      this.likesRepository.countByParentAndStatus(
        parentId,
        parentType,
        LikeStatus.Dislike,
      ),
    ]);

    return { likesCount, dislikesCount };
  }
}
