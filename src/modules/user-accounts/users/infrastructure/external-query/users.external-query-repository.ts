import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, UserDocument, type UserModelType } from '../../domain';

@Injectable()
export class UsersExternalQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async findUsersByUserIds(userIds: string[]): Promise<UserDocument[]> {
    return this.UserModel.find({
      _id: {
        $in: userIds.map((id) => new Types.ObjectId(id)),
      },
    })
      .lean()
      .exec();
  }
}
