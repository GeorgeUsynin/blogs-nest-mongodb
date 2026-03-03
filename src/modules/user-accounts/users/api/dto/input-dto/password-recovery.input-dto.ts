import { Matches } from 'class-validator';
import { emailConstraints } from '../../../domain';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class PasswordRecoveryInputDto {
  @Matches(emailConstraints.match)
  @IsStringWithTrim()
  email: string;
}
