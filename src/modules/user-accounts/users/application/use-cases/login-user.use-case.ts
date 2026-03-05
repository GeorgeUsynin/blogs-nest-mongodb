import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../constants';

export class LoginUserCommand extends Command<{ accessToken: string }> {
  constructor(public readonly userId: string) {
    super();
  }
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<
  LoginUserCommand,
  { accessToken: string }
> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
  ) {}

  async execute({
    userId,
  }: LoginUserCommand): Promise<{ accessToken: string }> {
    const payload = { userId };

    const accessToken = this.accessTokenContext.sign(payload);

    return { accessToken };
  }
}
