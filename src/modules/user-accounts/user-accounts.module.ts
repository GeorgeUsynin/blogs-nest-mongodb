import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain';
import { UsersController } from './api';
import {
  UsersService,
  UsersExternalService,
  PasswordHasherService,
} from './application';
import {
  UsersRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
} from './infrastructure';

const providers = [
  UsersService,
  UsersExternalService,
  UsersRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
  PasswordHasherService,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [...providers],
})
export class UserAccountsModule {}
