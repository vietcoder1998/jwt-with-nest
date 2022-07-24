import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { middleware } from './app.middleware';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: false,
  });

  // https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      //disableErrorMessages: false,
      //transform: true, // transform object to DTO class
    }),
  );
  app.useStaticAssets(path.join(__dirname, '..', 'mail-templates'));
  middleware(app);

  const config = new DocumentBuilder()
    .setTitle('Test')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Express Middleware
  await app.listen(process.env.PORT);
}

// eslint-disable-next-line no-console
bootstrap()
  .then(() => console.log('Bootstrap', new Date().toLocaleString()))
  .then(() => console.log(`http://localhost:${process.env.PORT}/api`))
  .catch(console.error);
