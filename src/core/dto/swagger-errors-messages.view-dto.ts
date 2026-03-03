import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessage } from '../exceptions';

class FieldErrorDto implements ErrorMessage {
  @ApiProperty({
    type: String,
    description: 'Message with error explanation for certain field',
    required: true,
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'What field/property of input model has error',
    required: true,
  })
  field: string;
}

export class SwaggerErrorsMessagesViewDto {
  @ApiProperty({
    type: [FieldErrorDto],
  })
  errorsMessages: FieldErrorDto[];
}
