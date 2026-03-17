export { UsersController, AuthController } from './api';
export { User, UserSchema } from './domain';
import { PasswordHasherService, AuthService } from './application';
import {
  ConfirmRegistrationUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  NewPasswordUseCase,
  RecoverPasswordUseCase,
  RegisterUserUseCase,
  ResendEmailConfirmationUseCase,
  UpdateTokensUseCase,
} from './application/use-cases';
import { UserAccountsConfig } from './config';
import { JwtCookiesStrategy, JwtHeaderStrategy } from './guards/bearer';
import { LocalStrategy } from './guards/local';
import {
  UsersRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
  UsersExternalRepository,
} from './infrastructure';

export const usersProviders = [
  UsersRepository,
  UsersExternalRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
  UserAccountsConfig,
];

export const authProviders = [
  AuthService,
  PasswordHasherService,
  LocalStrategy,
  JwtHeaderStrategy,
  JwtCookiesStrategy,
];

export const usersUseCases = [
  LoginUserUseCase,
  RegisterUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  RecoverPasswordUseCase,
  ConfirmRegistrationUseCase,
  NewPasswordUseCase,
  ResendEmailConfirmationUseCase,
  LogoutUserUseCase,
  UpdateTokensUseCase,
];
