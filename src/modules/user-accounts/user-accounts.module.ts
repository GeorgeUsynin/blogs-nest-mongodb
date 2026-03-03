import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  AuthController,
  authProviders,
  User,
  UserSchema,
  UsersController,
  usersProviders,
} from './users';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from './users/application/constants';
import { NotificationsModule } from '../notification';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      // useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
      useFactory: (): JwtService => {
        return new JwtService({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '5m',
          },
        });
      },
      // inject: [UserAccountsConfig],
    },
    ...usersProviders,
    ...authProviders,
  ],
})
export class UserAccountsModule {}
