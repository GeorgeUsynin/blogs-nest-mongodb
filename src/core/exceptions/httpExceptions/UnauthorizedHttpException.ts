import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes, ErrorMessages } from '../constants';

export type ErrorMessage = {
  message: string;
  field: string;
};

export class UnauthorizedHttpException extends HttpException {
  constructor(
    public readonly message: string = ErrorMessages.INVALID_CREDENTIALS,
    public readonly code: string = ErrorCodes.INVALID_CREDENTIALS,
  ) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
