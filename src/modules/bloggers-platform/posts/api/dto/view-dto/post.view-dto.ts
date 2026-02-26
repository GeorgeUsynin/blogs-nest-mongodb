import { ApiProperty } from '@nestjs/swagger';
import { LikeStatus } from '../../../../likes/domain';
import { PostReadDto } from '../../../infrastructure/query';

class NewestLike {
  @ApiProperty({ type: Date })
  addedAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  login: string;
}

class ExtendedLikesInfo {
  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  dislikesCount: number;

  @ApiProperty()
  myStatus: LikeStatus;

  @ApiProperty({ type: [NewestLike] })
  newestLikes: NewestLike[];
}

export class PostViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  blogName: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: ExtendedLikesInfo })
  extendedLikesInfo: ExtendedLikesInfo;

  public static mapToView(post: PostReadDto): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: post.likesInfo.likesCount,
      dislikesCount: post.likesInfo.dislikesCount,
      myStatus: post.myStatus,
      newestLikes: post.newestLikes.map((like) => ({
        addedAt: like.createdAt,
        userId: like.authorId,
        login: like.authorLogin,
      })),
    };

    return dto;
  }
}
