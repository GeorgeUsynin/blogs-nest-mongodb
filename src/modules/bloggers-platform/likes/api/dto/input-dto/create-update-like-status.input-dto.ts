import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../domain';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class CreateUpdateLikeStatusInputDto {
  @IsEnum(LikeStatus)
  @IsStringWithTrim()
  likeStatus: LikeStatus;
}
