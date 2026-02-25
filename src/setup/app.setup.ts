import { pipesSetup } from './pipes.setup';
import { INestApplication } from '@nestjs/common';
import { GLOBAL_PREFIX, globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { Request, Response } from 'express';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);

  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.redirect(`/${GLOBAL_PREFIX}`);
  });
}
