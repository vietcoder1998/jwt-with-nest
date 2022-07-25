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
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { QueryUserDto } from 'src/modules/user/user.dto';
import { UserService } from 'src/modules/user/user.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService, private i18n: I18nService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async find(
    @Query() { username, skip, take }: QueryUserDto,
    @Headers('x-lang') lang: string,
    @Request() req,
  ): Promise<any> {
    return await this.userService.find(skip, take, username);
  }
}
