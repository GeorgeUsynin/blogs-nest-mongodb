import { INestApplication, RequestMethod } from '@nestjs/common';
import { GLOBAL_PREFIX } from '../constants';

export function globalPrefixSetup(app: INestApplication) {
  // add prefix to all routes
  app.setGlobalPrefix(GLOBAL_PREFIX, {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
}
