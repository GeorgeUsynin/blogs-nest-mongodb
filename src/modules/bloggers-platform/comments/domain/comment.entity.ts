import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Query } from 'mongoose';
import { CreateCommentDomainDto } from './dto';
import { contentConstraints } from './comment.entity-constraints';
import { Likeable } from '../../shared/domain';

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Comment extends Likeable {
  @Prop({ type: String, required: true, ...contentConstraints })
  content: string;

  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  static createComment(dto: CreateCommentDomainDto): CommentDocument {
    // comment -> CommentDocument
    // this -> CommentModel
    const comment = new this(); //this will be a CommentModel when we will call createComment method!

    comment.content = dto.content;
    comment.commentatorInfo = { userId: dto.userId, userLogin: dto.userLogin };
    comment.postId = dto.postId;

    return comment as CommentDocument;
  }

  makeDeleted() {
    if (this.isDeleted) {
      // TODO: improve error
      throw new Error('Entity already deleted');
    }

    this.isDeleted = true;
    this.deletedAt = new Date();
  }

  updateContent(content: string) {
    this.content = content;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Registers the entity methods in the schema
CommentSchema.loadClass(Comment);

// Apply soft-delete filtering to read queries by default:
// exclude documents marked as `isDeleted: true` for find/findOne/countDocuments.
CommentSchema.pre(/^find/, function () {
  const that = this as Query<unknown, CommentDocument>;
  that.where({ isDeleted: false });
});
CommentSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

// Type of the document
export type CommentDocument = HydratedDocument<Comment>;

// Type of the model + static methods
export type CommentModelType = Model<CommentDocument> & typeof Comment;
