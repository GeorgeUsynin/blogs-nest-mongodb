import { ICommandHandler } from '@nestjs/cqrs';
import { PostNotFoundError } from '../../../../../core/exceptions';
import { PostsRepository } from '../../infrastructure';
import { CreateUpdatePostLikeStatusDto } from '../dto';
import { LikesService } from '../../../likes/application';
import { ParentType } from '../../../likes/domain';

export class CreateUpdatePostLikeStatusCommand {
  constructor(public readonly dto: CreateUpdatePostLikeStatusDto) {}
}

export class CreateUpdatePostLikeStatusUseCase implements ICommandHandler<CreateUpdatePostLikeStatusCommand> {
  constructor(
    private likesService: LikesService,
    private postsRepository: PostsRepository,
  ) {}

  async execute({ dto }: CreateUpdatePostLikeStatusCommand): Promise<void> {
    const { postId, userId, likeStatus } = dto;

    const foundPost = await this.postsRepository.findById(postId);
    if (!foundPost) {
      throw new PostNotFoundError();
    }

    await this.likesService.setLikeStatus({
      authorId: userId,
      parentId: postId,
      parentType: ParentType.Post,
      likeStatus,
    });

    // recalculate and update post likesCount info
    const { likesCount, dislikesCount } =
      await this.likesService.getLikesCounts(postId, ParentType.Post);
    foundPost.updateLikesCounts(likesCount, dislikesCount);

    await this.postsRepository.save(foundPost);
  }
}
