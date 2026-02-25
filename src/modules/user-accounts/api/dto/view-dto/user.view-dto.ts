import { SchemaTimestampsConfig } from 'mongoose';
import { UserDocument } from '../../../domain';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: SchemaTimestampsConfig['createdAt'];

  public static mapToView(user: UserDocument): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user._id.toString();
    dto.email = user.email;
    dto.login = user.login;
    dto.createdAt = user.createdAt;

    return dto;
  }
}
