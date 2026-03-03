import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseDomainException } from '../domainExceptions';
import { ErrorCode, ErrorField } from '../constants';
import { BadRequestHttpException } from '../httpExceptions';
import { ErrorMessage } from '../httpExceptions';

export type HttpResponseBody = {
  timestamp: string;
  path: string | null;
  message?: string;
  field?: ErrorField;
  code?: ErrorCode;
  errorsMessages?: ErrorMessage[];
};

export abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request): void;

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.onCatch(exception, response, request);
  }

  getDefaultHttpBody(url: string, exception: unknown): HttpResponseBody {
    const isBaseDomainException = exception instanceof BaseDomainException;
    const isBadRequestHttpException =
      exception instanceof BadRequestHttpException;

    return {
      timestamp: new Date().toISOString(),
      path: url,
      ...((exception as any).message
        ? { message: (exception as any).message }
        : {}),
      ...(isBaseDomainException && exception.code
        ? { code: exception.code }
        : {}),
      ...(isBaseDomainException && exception.field
        ? { field: exception.field }
        : {}),
      ...(isBadRequestHttpException
        ? { errorsMessages: exception.errorsMessages }
        : {}),
    };
  }
}
