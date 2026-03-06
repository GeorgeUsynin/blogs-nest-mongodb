import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  AuthController,
  authProviders,
  useCases,
  User,
  UserSchema,
  UsersController,
  usersProviders,
} from './users';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './users/application/constants';
import { NotificationsModule } from '../notification';
import {
  UsersExternalQueryRepository,
  UsersExternalRepository,
} from './users/infrastructure';

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
          secret: process.env.JWT_ACCESS_SECRET,
          signOptions: {
            expiresIn: '5m',
          },
        });
      },
      // inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      // useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
      useFactory: (): JwtService => {
        return new JwtService({
          secret: process.env.JWT_REFRESH_SECRET,
          signOptions: {
            expiresIn: '10weeks',
          },
        });
      },
      // inject: [UserAccountsConfig],
    },
    ...usersProviders,
    ...authProviders,
    ...useCases,
  ],
  exports: [
    MongooseModule,
    UsersExternalRepository,
    UsersExternalQueryRepository,
  ],
})
export class UserAccountsModule {}
