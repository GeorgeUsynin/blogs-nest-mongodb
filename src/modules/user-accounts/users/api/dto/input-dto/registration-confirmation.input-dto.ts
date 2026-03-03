import { IsStringWithTrim } from '../../../../../../core/decorators';

export class RegistrationConfirmationInputDto {
  @IsStringWithTrim()
  code: string;
}
