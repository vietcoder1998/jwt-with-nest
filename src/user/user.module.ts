import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Profile } from '../entities/profile';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [TypeOrmModule.forFeature([User, Profile])],
  exports: [TypeOrmModule],
})
export class UserModule {}
