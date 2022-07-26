import {
  Controller,
  Get,
  Headers,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryUserDto } from './user.dto';
import { UserService } from './user.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async find(@Query() { username, skip, take }: QueryUserDto): Promise<any> {
    return await this.userService.find(skip, take, username);
  }
}
