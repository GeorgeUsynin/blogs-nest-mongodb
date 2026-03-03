import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExtractUserFromRequest } from '../guards/decorators';
import { UserContextDto } from '../guards/dto';
import { LocalAuthGuard } from '../guards/local';
import {
  AuthService,
  PasswordRecoveryService,
  RegistrationService,
} from '../application';
import {
  LoginApi,
  MeApi,
  NewPasswordApi,
  PasswordRecoveryApi,
  RegistrationApi,
  RegistrationConfirmationApi,
  RegistrationEmailResendingApi,
} from './swagger';
import {
  CreateUserInputDto,
  LoginSuccessViewDto,
  MeViewDto,
  NewPasswordInputDto,
  PasswordRecoveryInputDto,
  RegistrationConfirmationInputDto,
  RegistrationEmailResendingInputDto,
} from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtHeaderAuthGuard } from '../guards/bearer';
import { UsersQueryRepository } from '../infrastructure';
import { UserNotFoundError } from '../../../../core/exceptions';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private registrationService: RegistrationService,
    private passwordRecoveryService: PasswordRecoveryService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @MeApi()
  async me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    const foundUser = await this.usersQueryRepository.getUserById(user.userId);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    return MeViewDto.mapToView(foundUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginApi()
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<LoginSuccessViewDto> {
    const access_token = await this.authService.login(user.userId);

    return access_token;
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @PasswordRecoveryApi()
  async passwordRecovery(
    @Body() body: PasswordRecoveryInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.passwordRecoveryService.recoverPassword(email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @NewPasswordApi()
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    const { newPassword, recoveryCode } = body;

    await this.passwordRecoveryService.updateNewPassword(
      newPassword,
      recoveryCode,
    );
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationConfirmationApi()
  async registrationConfirmation(
    @Body() body: RegistrationConfirmationInputDto,
  ): Promise<void> {
    const { code } = body;

    await this.registrationService.confirmRegistration(code);
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationApi()
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    await this.registrationService.registerNewUser(body);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationEmailResendingApi()
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.registrationService.resendEmailConfirmationCode(email);
  }
}
