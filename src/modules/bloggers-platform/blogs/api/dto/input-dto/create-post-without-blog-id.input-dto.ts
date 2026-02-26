import { OmitType } from '@nestjs/mapped-types';
import { CreatePostInputDto } from '../../../../posts/api/dto';

export class CreatePostWithoutBlogIdInputDto extends OmitType(
  CreatePostInputDto,
  ['blogId'] as const,
) {}
