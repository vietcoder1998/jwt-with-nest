/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires

async function bootstrap(): Promise<void> {
  PassportModule.register({ session: true });

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
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: '',
        },
      },
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);

  // Express Middleware
  await app.listen(process.env.PORT);
}

// eslint-disable-next-line no-console
bootstrap()
  .then(() => console.log('Bootstrap', new Date().toLocaleString()))
  .then(() => console.log(`http://localhost:${process.env.PORT}/api`))
  .catch(console.error);
