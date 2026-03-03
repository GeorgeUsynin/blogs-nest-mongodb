import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtHeaderPayloadDto, UserContextDto } from '../dto';
import { UnauthorizedHttpException } from '../../../../../core/exceptions';
import { UsersRepository } from '../../infrastructure';

@Injectable()
export class JwtHeaderStrategy extends PassportStrategy(
  Strategy,
  'jwt-header',
) {
  constructor(
    // protected userAccountConfig: UserAccountsConfig,
    private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: userAccountConfig.JWT_SECRET,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtHeaderPayloadDto): Promise<UserContextDto> {
    // Checking if user exists
    const isUserExists = Boolean(
      await this.usersRepository.findById(payload.userId),
    );

    if (!isUserExists) {
      throw new UnauthorizedHttpException();
    }

    return { userId: payload.userId };
  }
}
