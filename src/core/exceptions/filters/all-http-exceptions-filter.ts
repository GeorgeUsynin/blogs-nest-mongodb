import { Request, Response } from 'express';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception-filter';

// All exceptions
@Catch()
export class AllHttpExceptionsFilter extends BaseExceptionFilter {
  onCatch(exception: unknown, response: Response, request: Request): void {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // TODO: use config
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        ...this.getDefaultHttpBody(request.url, exception),
        path: null,
        message: 'Some error occurred',
      });

      return;
    }

    response
      .status(status)
      .json(this.getDefaultHttpBody(request.url, exception));
  }
}
