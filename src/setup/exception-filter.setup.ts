import { INestApplication } from '@nestjs/common';
import { AllHttpExceptionsFilter } from '../core/exceptions/filters';
import { DomainExceptionsFilter } from '../core/exceptions/filters';
import { CoreConfig } from '../core/config';

export function exceptionFilterSetup(
  app: INestApplication,
  coreConfig: CoreConfig,
) {
  // Register our filters. The order is important here! (it will work from right to left)
  app.useGlobalFilters(
    new AllHttpExceptionsFilter(coreConfig),
    new DomainExceptionsFilter(),
  );
}
