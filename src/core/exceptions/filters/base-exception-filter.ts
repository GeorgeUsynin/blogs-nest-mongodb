import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

class TValidationError {
  message?: string;
  field?: string;
  code?: string;
}

export type ErrorViewModel = TValidationError[];

export type HttpResponseBody = {
  timestamp: string;
  path: string | null;
  status: number;
  errorsMessages: ErrorViewModel;
};

export abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request): void;

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.onCatch(exception, response, request);
  }

  createErrorMessages(errors: TValidationError[]): ErrorViewModel {
    return errors.map((error) => ({
      ...(error.message ? { message: error.message } : {}),
      ...(error.field ? { field: error.field } : {}),
      ...(error.code ? { code: error.code } : {}),
    }));
  }

  getDefaultHttpBody(
    url: string,
    status: HttpStatus,
    errorsMessages: ErrorViewModel,
  ): HttpResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: url,
      status,
      errorsMessages,
    };
  }
}
