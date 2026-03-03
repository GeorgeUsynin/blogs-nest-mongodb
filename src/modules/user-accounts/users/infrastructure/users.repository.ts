import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, type UserModelType } from '../domain';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findById(id);
  }

  async findUserByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ login });
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email });
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
  }

  async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async save(user: UserDocument): Promise<void> {
    await user.save();
  }
}
