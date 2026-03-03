import { HttpException, HttpStatus } from '@nestjs/common';

export type ErrorMessage = {
  message: string;
  field: string;
};

export class BadRequestHttpException extends HttpException {
  constructor(public readonly errorsMessages: ErrorMessage[]) {
    super('', HttpStatus.BAD_REQUEST);
  }
}
