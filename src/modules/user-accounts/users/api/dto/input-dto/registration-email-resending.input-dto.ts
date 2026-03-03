import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { emailConstraints } from '../../../domain';

export class RegistrationEmailResendingInputDto {
  @Matches(emailConstraints.match)
  @IsStringWithTrim()
  email: string;
}
