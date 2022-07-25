import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Profile } from 'src/entities/profile';
import { ProfileController } from 'src/modules/profile/profile.controller';
import { ProfileService } from 'src/modules/profile/profile.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

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
