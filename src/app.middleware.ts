import { INestApplication } from '@nestjs/common';

export function middleware(app: INestApplication): INestApplication {
  app.enableCors();
  return app;
}
