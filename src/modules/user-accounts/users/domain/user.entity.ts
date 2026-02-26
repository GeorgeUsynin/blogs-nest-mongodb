import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Model,
  Query,
  SchemaTimestampsConfig,
} from 'mongoose';
import { CreateUserDomainDto } from './dto';
import { emailConstraints, loginConstraints } from './user.entity-constraints';

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true, ...loginConstraints })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, unique: true, ...emailConstraints })
  email: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  static createConfirmedUser(dto: CreateUserDomainDto): UserDocument {
    // user -> UserDocument
    // this -> UserModel
    const user = new this();

    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;

    return user as UserDocument;
  }

  static createUnconfirmedUser(dto: CreateUserDomainDto): UserDocument {
    // user -> UserDocument
    // this -> UserModel
    const user = new this();

    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;

    return user as UserDocument;
  }

  makeDeleted() {
    if (this.isDeleted) {
      // TODO: improve error
      throw new Error('Entity has already been deleted');
    }

    this.isDeleted = true;
    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Registers the entity methods in the schema
UserSchema.loadClass(User);

// Apply soft-delete filtering to read queries by default:
// exclude documents marked as `isDeleted: true` for find/findOne/countDocuments.
UserSchema.pre(/^find/, function () {
  const that = this as Query<unknown, UserDocument>;
  that.where({ isDeleted: false });
});
UserSchema.pre('countDocuments', function () {
  this.where({ isDeleted: false });
});

// Type of the document
export type UserDocument = HydratedDocument<User>;

// Type of the model + static methods
export type UserModelType = Model<UserDocument> & typeof User;
