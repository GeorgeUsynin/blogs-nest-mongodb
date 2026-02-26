import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Query } from 'mongoose';
import { CreatePostDomainDto, UpdatePostDomainDto } from './dto';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from './post.entity-constraints';
import { Likeable } from '../../shared/domain/';

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Post extends Likeable {
  @Prop({ type: String, required: true, ...titleConstraints })
  title: string;

  @Prop({ type: String, required: true, ...shortDescriptionConstraints })
  shortDescription: string;

  @Prop({
    type: String,
    required: true,
    ...contentConstraints,
  })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  static createPost(dto: CreatePostDomainDto): PostDocument {
    // post -> PostDocument
    // this -> PostModel
    const post = new this();

    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.content = dto.content;
    post.shortDescription = dto.shortDescription;
    post.title = dto.title;

    return post as PostDocument;
  }

  makeDeleted() {
    if (this.isDeleted) {
      // TODO: improve error
      throw new Error('Entity already deleted');
    }

    this.isDeleted = true;
    this.deletedAt = new Date();
  }

  updatePost(dto: UpdatePostDomainDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Registers the entity methods in the schema
PostSchema.loadClass(Post);

// Apply soft-delete filtering to read queries by default:
// exclude documents marked as `isDeleted: true` for find/findOne/countDocuments.
PostSchema.pre(/^find/, function () {
  const that = this as Query<unknown, PostDocument>;
  that.where({ isDeleted: false });
});
PostSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

// Type of the document
export type PostDocument = HydratedDocument<Post>;

// Type of the model + static methods
export type PostModelType = Model<PostDocument> & typeof Post;
