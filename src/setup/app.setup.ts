import cookieParser from 'cookie-parser';
import { pipesSetup } from './pipes.setup';
import { INestApplication } from '@nestjs/common';
import { GLOBAL_PREFIX, globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { Request, Response } from 'express';
import { exceptionFilterSetup } from './exception-filter.setup';

export function appSetup(app: INestApplication) {
  // Enable CORS
  app.enableCors();
  // Setup global pipes
  pipesSetup(app);
  // Setup global prefix
  globalPrefixSetup(app);
  // Setup swagger
  swaggerSetup(app);
  // Setup exception filters
  exceptionFilterSetup(app);
  // Add cookie parser
  app.use(cookieParser());
  // Allows to get correct IP address from req.ip
  // @ts-expect-error need proper type
  app.set('trust proxy', true);

  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.redirect(`/${GLOBAL_PREFIX}`);
  });
}
