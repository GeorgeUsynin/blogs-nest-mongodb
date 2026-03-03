import { applyDecorators } from '@nestjs/common';
import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

import { Trim } from '../transform';

export const IsStringWithTrim = () =>
  // Combines decorators
  applyDecorators(
    // Trim transform decorator applied first, before validation decorators !!!
    Trim(),
    // Call order: @IsDefined() -> @IsString() -> @IsNotEmpty()
    IsDefined(),
    IsString(),
    IsNotEmpty(),
  );
