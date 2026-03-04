import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Query } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { CreateUserDomainDto } from './dto';
import { emailConstraints, loginConstraints } from './user.entity-constraints';
import {
  ConfirmationCodeExpired,
  EmailAlreadyConfirmedByCode,
  InvalidConfirmationCode,
  InvalidPasswordRecoveryCode,
  PasswordRecoveryCodeExpired,
  UserAlreadyDeleted,
} from '../../../../core/exceptions';
import { SETTINGS } from './constants';

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

  @Prop({
    type: {
      isConfirmed: Boolean,
      confirmationCode: String,
      expirationDate: String,
    },
    default: {
      isConfirmed: false,
      confirmationCode: null,
      expirationDate: null,
    }, // Set default object
    _id: false,
  })
  emailConfirmation: {
    isConfirmed: boolean;
    confirmationCode: string | null;
    expirationDate: string | null;
  };

  @Prop({
    type: {
      recoveryCode: String,
      expirationDate: String,
    },
    default: {
      recoveryCode: null,
      expirationDate: null,
    }, // Set default object
    _id: false,
  })
  passwordRecovery: {
    recoveryCode: string | null;
    expirationDate: string | null;
  };

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
    user.emailConfirmation.isConfirmed = true;

    return user as UserDocument;
  }

  static createUnconfirmedUser(dto: CreateUserDomainDto): UserDocument {
    // user -> UserDocument
    // this -> UserModel
    const user = new this();

    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
    user.createEmailConfirmationCode();

    return user as UserDocument;
  }

  createAndUpdatePasswordRecoveryCode() {
    const recoveryCode = randomUUID();
    const expirationDate = add(new Date(), {
      hours: SETTINGS.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS,
    }).toISOString();

    this.passwordRecovery.recoveryCode = recoveryCode;
    this.passwordRecovery.expirationDate = expirationDate;

    return recoveryCode;
  }

  updatePasswordByRecoveryCode(code: string, passwordHash: string) {
    if (this.passwordRecovery.recoveryCode !== code) {
      throw new InvalidPasswordRecoveryCode();
    }

    if (Date.now() > Date.parse(this.passwordRecovery.expirationDate!)) {
      throw new PasswordRecoveryCodeExpired();
    }

    this.passwordHash = passwordHash;
  }

  confirmUserEmail(code: string) {
    if (this.emailConfirmation.isConfirmed) {
      throw new EmailAlreadyConfirmedByCode();
    }

    if (this.emailConfirmation.confirmationCode !== code) {
      throw new InvalidConfirmationCode();
    }

    if (Date.now() > Date.parse(this.emailConfirmation.expirationDate!)) {
      throw new ConfirmationCodeExpired();
    }

    this.emailConfirmation.isConfirmed = true;
  }

  regenerateEmailConfirmationCode() {
    if (this.emailConfirmation.isConfirmed) {
      throw new EmailAlreadyConfirmedByCode();
    }

    const confirmationCode = this.createEmailConfirmationCode();

    return confirmationCode;
  }

  createEmailConfirmationCode() {
    const newConfirmationCode = randomUUID();
    const newExpirationDate = add(new Date(), {
      hours: SETTINGS.EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
    }).toISOString();

    this.emailConfirmation.confirmationCode = newConfirmationCode;
    this.emailConfirmation.expirationDate = newExpirationDate;

    return newConfirmationCode;
  }

  makeDeleted() {
    if (this.isDeleted) {
      throw new UserAlreadyDeleted();
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
