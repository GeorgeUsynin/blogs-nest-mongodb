import { OmitType } from '@nestjs/mapped-types';
import { CreatePostDomainDto } from './create-post.domain-dto';

export class UpdatePostDomainDto extends OmitType(CreatePostDomainDto, [
  'blogName',
] as const) {}
