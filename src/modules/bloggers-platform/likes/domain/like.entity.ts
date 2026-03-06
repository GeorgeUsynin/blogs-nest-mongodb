import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus, NonNoneLikeStatus, ParentType } from './types';
import { CreateLikeDomainDto } from './dto';

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Like {
  @Prop({ type: String, required: true })
  authorId: string;

  @Prop({ type: String, required: true })
  parentId: string;

  @Prop({ type: String, enum: ParentType, required: true })
  parentType: ParentType;

  @Prop({ type: String, enum: LikeStatus, required: true })
  likeStatus: LikeStatus;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  static createLike(dto: CreateLikeDomainDto): LikeDocument {
    // like -> LikeDocument
    // this -> LikeModel
    const like = new this();

    like.authorId = dto.authorId;
    like.parentId = dto.parentId;
    like.parentType = dto.parentType;
    like.likeStatus = dto.likeStatus;

    return like as LikeDocument;
  }

  isSameLikeStatus(likeStatus: LikeStatus) {
    return this.likeStatus === likeStatus;
  }

  updateLikeStatus(likeStatus: NonNoneLikeStatus) {
    this.likeStatus = likeStatus;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Registers the entity methods in the schema
LikeSchema.loadClass(Like);

// Type of the document
export type LikeDocument = HydratedDocument<Like>;

// Type of the model + static methods
export type LikeModelType = Model<LikeDocument> & typeof Like;
