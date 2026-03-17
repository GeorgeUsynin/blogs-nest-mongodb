import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenViewDto {
  @ApiProperty()
  accessToken: string;
}
