import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../application';
import { UnauthorizedHttpException } from '../../../../../core/exceptions';
import { UserContextDto } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto> {
    if (typeof loginOrEmail !== 'string' || typeof password !== 'string') {
      throw new UnauthorizedHttpException();
    }

    const user = await this.authService.validateUser(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedHttpException();
    }

    return user;
  }
}
