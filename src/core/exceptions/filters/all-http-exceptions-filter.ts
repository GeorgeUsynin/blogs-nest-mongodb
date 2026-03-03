import { Request, Response } from 'express';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception-filter';
import { BadRequestHttpException } from '../httpExceptions';

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
      const errorsMessages = this.createErrorMessages([
        {
          message: 'Some error occurred',
        },
      ]);
      response.status(status).json({
        ...this.getDefaultHttpBody(request.url, status, errorsMessages),
        path: null,
      });

      return;
    }

    if (exception instanceof BadRequestHttpException) {
      response
        .status(status)
        .json(
          this.getDefaultHttpBody(
            request.url,
            status,
            exception.errorsMessages,
          ),
        );
      return;
    }

    const errorsMessages = this.createErrorMessages([exception as any]);

    response
      .status(status)
      .json(this.getDefaultHttpBody(request.url, status, errorsMessages));
  }
}
