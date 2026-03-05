import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ExtractUserFromRequest } from '../guards/decorators';
import { UserContextDto } from '../guards/dto';
import { LocalAuthGuard } from '../guards/local';
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
import {
  ConfirmRegistrationCommand,
  LoginUserCommand,
  NewPasswordCommand,
  RecoverPasswordCommand,
  RegisterUserCommand,
  ResendEmailConfirmationCommand,
} from '../application/use-cases';

@Controller('auth')
export class AuthController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
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
    return this.commandBus.execute(new LoginUserCommand(user.userId));
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @PasswordRecoveryApi()
  async passwordRecovery(
    @Body() body: PasswordRecoveryInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.commandBus.execute(new RecoverPasswordCommand(email));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @NewPasswordApi()
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    const { newPassword, recoveryCode } = body;

    await this.commandBus.execute(
      new NewPasswordCommand(newPassword, recoveryCode),
    );
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationConfirmationApi()
  async registrationConfirmation(
    @Body() body: RegistrationConfirmationInputDto,
  ): Promise<void> {
    const { code } = body;

    await this.commandBus.execute(new ConfirmRegistrationCommand(code));
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationApi()
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    await this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationEmailResendingApi()
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.commandBus.execute(new ResendEmailConfirmationCommand(email));
  }
}
