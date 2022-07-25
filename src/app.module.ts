import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmModule } from 'nestjs-fcm';
import { HeaderResolver, I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AuthenticationMiddleware } from './modules/auth/auth.middleware';
import { Profile } from './entities/profile';
import { User } from './entities/user';
import { AllExceptionFilter } from './filter/exception.filter';
import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UserModule } from './modules/user/user.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  imports: [
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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Profile],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
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
      .exclude(
        { path: '/app/config', method: RequestMethod.GET },
        { path: '/payment/ios/refund', method: RequestMethod.POST },
        { path: '/article/term', method: RequestMethod.GET },
        { path: '/article/policy', method: RequestMethod.GET },
        { path: '/article/what-is-secret-phrase', method: RequestMethod.GET },
        { path: '/article/user-guide', method: RequestMethod.GET },

        // {path: '/auth/check', method: RequestMethod.GET},
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
