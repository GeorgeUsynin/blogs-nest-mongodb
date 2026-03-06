import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, type UserModelType } from '../domain';

@Injectable()
export class UsersExternalRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findById(id);
  }
}
