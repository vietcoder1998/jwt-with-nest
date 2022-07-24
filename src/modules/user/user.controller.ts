import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from '../../logger/index';
import { AuthService } from '../auth/auth.service';
import { ChangePassDto } from './user.dto';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  private logger: LoggerService = new LoggerService();

  constructor(private userService: UserService, private i18n: I18nService) {}

  @UseGuards(JwtModule)
  @Post('change-pass')
  async changePass(
    @Body() { password, old_password }: ChangePassDto,
    @Headers('x-lang') lang: string,
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
}
