import { Matches, MaxLength } from 'class-validator';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from '../../../domain';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class CreateBlogInputDto {
  @MaxLength(nameConstraints.maxLength)
  @IsStringWithTrim()
  name: string;

  @MaxLength(descriptionConstraints.maxLength)
  @IsStringWithTrim()
  description: string;

  @Matches(websiteUrlConstraints.match)
  @MaxLength(websiteUrlConstraints.maxLength)
  @IsStringWithTrim()
  websiteUrl: string;
}
