import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Profile } from '../../entities/profile';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, Profile])],
  exports: [TypeOrmModule],
})
export class UserModule {}
