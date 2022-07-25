import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { isEmpty } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from '../../logger/index';
import { ChangePassDto, QueryUserDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  private logger: LoggerService = new LoggerService();

  constructor(private userService: UserService, private i18n: I18nService) {}

  @UseGuards(JwtModule)
  @Post('change-pass')
  async changePass(
    @Body() { password, old_password }: ChangePassDto,
    @Headers('x-lang')
    lang: string,
    @Param('uid') uid: string,
    @Request() req,
  ): Promise<any> {
    if (isEmpty(password) || password !== old_password) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.MINIMUM_LENGTH_PASSWORD', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password.length < 5) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.MINIMUM_LENGTH_PASSWORD', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userService.changePass(uid, password, lang);
  }

  @Get()
  async find(
    @Query() { username, skip, take }: QueryUserDto,
    @Headers('x-lang') lang: string,
    @Request() req,
  ): Promise<any> {
    return await this.userService.find(skip, take, username);
  }
}
