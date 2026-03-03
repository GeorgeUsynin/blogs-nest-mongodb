import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

// Custom pipe example
// https://docs.nestjs.com/pipes#custom-pipes
@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid ObjectId: ${value}`);
    }

    return value;
  }
}
