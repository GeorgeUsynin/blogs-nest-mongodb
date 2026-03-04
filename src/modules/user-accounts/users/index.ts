export { UsersController, AuthController } from './api';
export { User, UserSchema } from './domain';
import {
  UsersService,
  UsersExternalService,
  PasswordHasherService,
  PasswordRecoveryService,
  RegistrationService,
  AuthService,
} from './application';
import { JwtHeaderStrategy } from './guards/bearer';
import { LocalStrategy } from './guards/local';
import {
  UsersRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
} from './infrastructure';

export const usersProviders = [
  UsersService,
  UsersExternalService,
  UsersRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
];

export const authProviders = [
  AuthService,
  PasswordRecoveryService,
  PasswordHasherService,
  RegistrationService,
  LocalStrategy,
  JwtHeaderStrategy,
];
