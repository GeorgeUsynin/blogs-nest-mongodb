import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../infrastructure';
import { PasswordHasherService } from './password-hasher.service';
import { UserContextDto } from '../guards/dto';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasherService: PasswordHasherService,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const isValidPassword = await this.passwordHasherService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) return null;

    // if (!user.emailConfirmation.isConfirmed) {
    //   throw new UnauthorizedHttpException(
    //     'Email address is not confirmed',
    //     'EMAIL_NOT_CONFIRMED',
    //   );
    // }

    return { userId: user._id.toString() };
  }

  async login(userId: string): Promise<{
    accessToken: string;
  }> {
    const payload = { userId };

    const accessToken = this.accessTokenContext.sign(payload);

    return { accessToken };
  }
}
