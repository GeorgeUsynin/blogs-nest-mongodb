import { INestApplication } from '@nestjs/common';
import { AllHttpExceptionsFilter } from '../core/exceptions/filters';
import { DomainExceptionsFilter } from '../core/exceptions/filters';

export function exceptionFilterSetup(app: INestApplication) {
  // Register our filters. The order is important here! (it will work from right to left)
  app.useGlobalFilters(
    new AllHttpExceptionsFilter(),
    new DomainExceptionsFilter(),
  );
}
