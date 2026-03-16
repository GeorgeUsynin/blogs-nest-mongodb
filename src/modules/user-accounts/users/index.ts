export { UsersController, AuthController } from './api';
export { User, UserSchema } from './domain';
import { PasswordHasherService, AuthService } from './application';
import {
  ConfirmRegistrationUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  NewPasswordUseCase,
  RecoverPasswordUseCase,
  RegisterUserUseCase,
  ResendEmailConfirmationUseCase,
} from './application/use-cases';
import { UserAccountsConfig } from './config';
import { JwtHeaderStrategy } from './guards/bearer';
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
];

export const useCases = [
  LoginUserUseCase,
  RegisterUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  RecoverPasswordUseCase,
  ConfirmRegistrationUseCase,
  NewPasswordUseCase,
  ResendEmailConfirmationUseCase,
];
