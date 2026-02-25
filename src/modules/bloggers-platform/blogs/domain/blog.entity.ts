import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateBlogDomainDto, UpdateBlogDomainDto } from './dto';

export const websiteUrlConstraints = {
  maxLength: 100,
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};

export const nameConstraints = {
  maxLength: 15,
};

export const descriptionConstraints = {
  maxLength: 500,
};

export // The timestamp flag automatically adds the updatedAt and createdAt fields


@Schema({ timestamps: true })
class Blog {
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

  static createBlog(dto: CreateBlogDomainDto): BlogDocument {
    // user -> BlogDocument
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
BlogSchema.pre('find', function () {
  this.where({ isDeleted: false });
});
BlogSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});
BlogSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

// Type of the document
export type BlogDocument = HydratedDocument<Blog> & SchemaTimestampsConfig;

// Type of the model + static methods
export type BlogModelType = Model<BlogDocument> & typeof Blog;
