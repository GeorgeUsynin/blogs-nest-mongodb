import { Length, Matches } from 'class-validator';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from '../../../domain';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class CreateUserInputDto {
  // Call order: @IsStringWithTrim() -> @Matches() -> @Length()
  @Matches(loginConstraints.match)
  @Length(loginConstraints.minLength, loginConstraints.maxLength)
  @IsStringWithTrim()
  login: string;

  @Matches(emailConstraints.match)
  @IsStringWithTrim()
  email: string;

  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @IsStringWithTrim()
  password: string;
}
