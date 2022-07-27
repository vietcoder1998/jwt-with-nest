import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { Profile } from '../entities/profile';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [TypeOrmModule.forFeature([User, Profile])],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
