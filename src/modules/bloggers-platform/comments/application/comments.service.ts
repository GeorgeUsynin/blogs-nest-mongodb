import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsRepository } from '../infrastructure';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { Comment, type CommentModelType } from '../domain';
import { PostsRepository } from '../../posts/infrastructure';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async createComment(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<string> {
    const foundPost = await this.postsRepository.findById(postId);
    if (!foundPost) {
      // throw new PostNotFoundError();
      throw new Error();
    }

    // const user = await this.usersRepository.findById(userId);

    // if (!user) {
    //   throw new UserNotFoundError();
    // }

    const newComment = this.CommentModel.createComment({
      content: dto.content,
      postId,
      userId,
      // userLogin: user.login,
      userLogin: 'user.login',
    });

    await this.commentsRepository.save(newComment);

    return newComment._id.toString();
  }

  async updateById(userId: string, dto: UpdateCommentDto): Promise<void> {
    const foundComment = await this.commentsRepository.findById(dto.id);
    if (!foundComment) {
      // throw new CommentNotFoundError();
      throw new Error();
    }

    // foundComment.ensureCommentOwner(userId);
    foundComment.updateContent(dto.content);

    await this.commentsRepository.save(foundComment);
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const foundComment = await this.commentsRepository.findById(id);

    if (!foundComment) {
      // throw new CommentNotFoundError();
      throw new Error();
    }

    // foundComment.ensureCommentOwner(userId);
    foundComment.makeDeleted();

    await this.commentsRepository.save(foundComment);
  }
}
