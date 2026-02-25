import { INestApplication, ValidationPipe } from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
  // Global pipe for validation and transformation of incoming data.

  app.useGlobalPipes(
    new ValidationPipe({
      // Converts plain request payloads to DTO instances and applies type casting based on DTO metadata.
      transform: true,
    }),
  );
}
