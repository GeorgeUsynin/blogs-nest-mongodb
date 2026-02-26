import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter } from 'mongoose';
import { GetUsersQueryParamsInputDto } from '../../api/dto';
import { User, UserDocument, type UserModelType } from '../../domain';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getAllUsers(
    query: GetUsersQueryParamsInputDto,
  ): Promise<{ items: UserDocument[]; totalCount: number }> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
    } = query;

    const filter: QueryFilter<UserDocument> = {};

    if (searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: searchLoginTerm, $options: 'i' },
      });
    }

    if (searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: searchEmailTerm, $options: 'i' },
      });
    }

    const [items, totalCount] = await Promise.all([
      this.UserModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(query.calculateSkip())
        .limit(pageSize)
        .lean()
        .exec(),
      this.UserModel.countDocuments(filter).exec(),
    ]);

    return { items, totalCount };
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findById(id).lean().exec();
  }
}
