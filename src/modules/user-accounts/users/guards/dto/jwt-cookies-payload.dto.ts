import { JwtBasePayloadDto } from './jwt-base-payload.dto';

export class JwtCookiesPayloadDto extends JwtBasePayloadDto {
  userId: string;
  deviceId: string;
}
