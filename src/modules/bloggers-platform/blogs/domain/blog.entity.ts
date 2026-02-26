import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  SchemaTimestampsConfig,
  Query,
} from 'mongoose';
import { CreateBlogDomainDto, UpdateBlogDomainDto } from './dto';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from './blog.entity-constraints';

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true, ...nameConstraints })
  name: string;

  @Prop({ type: String, required: true, ...descriptionConstraints })
  description: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({
    type: String,
    required: true,
    ...websiteUrlConstraints,
  })
  websiteUrl: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  static createBlog(dto: CreateBlogDomainDto): BlogDocument {
    // blog -> BlogDocument
    // this -> BlogModel
    const blog = new this();

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return blog as BlogDocument;
  }

  makeDeleted() {
    if (this.isDeleted) {
      // TODO: improve error
      throw new Error('Entity already deleted');
    }

    this.isDeleted = true;
    this.deletedAt = new Date();
  }

  update(dto: UpdateBlogDomainDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Registers the entity methods in the schema
BlogSchema.loadClass(Blog);

// Apply soft-delete filtering to read queries by default:
// exclude documents marked as `isDeleted: true` for find/findOne/countDocuments.
BlogSchema.pre(/^find/, function () {
  const that = this as Query<unknown, BlogDocument>;
  that.where({ isDeleted: false });
});
BlogSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

// Type of the document
export type BlogDocument = HydratedDocument<Blog>;

// Type of the model + static methods
export type BlogModelType = Model<BlogDocument> & typeof Blog;
