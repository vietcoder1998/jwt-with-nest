import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmModule } from 'nestjs-fcm';
import { HeaderResolver, I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AuthenticationMiddleware } from './auth/auth.middleware';
import { Profile } from './entities/profile';
import { User } from './entities/user';
import { AllExceptionFilter } from './filter/exception.filter';
import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

export const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'vi-*': 'vi',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: process.env.NODE_ENV == 'development',
      },
      resolvers: [new HeaderResolver(['x-lang'])],
    }),
    FcmModule.forRoot({
      firebaseSpecsPath: path.join(__dirname, '../firebase.spec.json'),
    }),
    ScheduleModule.forRoot(),

    /// mysql connect
    TypeOrmModule.forRoot({
      type: 'mysql',
      name: configService.get('CONNECTION_NAME'),
      host: configService.get('DB_HOST'),
      port: parseInt(configService.get('DB_PORT')),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASS'),
      database: configService.get('DB_NAME'),
      entities: [User, Profile],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
  ],
  exports: [I18nModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });

    consumer
      .apply(AuthenticationMiddleware)
      .exclude()
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
