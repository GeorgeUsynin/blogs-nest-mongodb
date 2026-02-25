import { INestApplication } from '@nestjs/common';

export const GLOBAL_PREFIX = 'api';

export function globalPrefixSetup(app: INestApplication) {
  // add prefix to all routes
  app.setGlobalPrefix(GLOBAL_PREFIX);
}
