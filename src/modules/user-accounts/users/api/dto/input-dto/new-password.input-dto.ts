import { Length } from 'class-validator';
import { passwordConstraints } from '../../../domain';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class NewPasswordInputDto {
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @IsStringWithTrim()
  newPassword: string;

  @IsStringWithTrim()
  recoveryCode: string;
}
