import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup';
import { initAppModule } from './init-app-module';
import { CoreConfig } from './core/config';

async function bootstrap() {
  const dynamicAppModule = await initAppModule();
  // Create our Application based on the configured module
  const app = await NestFactory.create(dynamicAppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  // global app settings
  appSetup(app, coreConfig);

  const PORT = coreConfig.PORT || 3000;

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
