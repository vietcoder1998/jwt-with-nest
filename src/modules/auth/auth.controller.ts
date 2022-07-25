import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { genSaltSync, hash } from 'bcrypt';
import { isEmpty } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import {
  ChangePassDto,
  RegisterDto,
  UserSignInDto,
} from 'src/modules/auth/auth.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalAuthGuard } from 'src/modules/auth/local-auth.guard';

export const IS_PUBLIC_KEY = 'SkipAuth';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
@ApiTags('Authenticate')
export class AuthController {
  constructor(private authService: AuthService, private i18n: I18nService) {}

  @ApiBody({
    schema: {
      type: 'object',
      default: {
        username: 'hello_world',
        password: '123456',
        email: 'abc@gmail.com',
        phone: '008888888',
        firstName: 'Hello ',
        lastName: 'World',
      },
    },
  })
  @Public()
  @Post('sign-up')
  async signUp(
    @Body()
    { username, password, firstName, lastName, email, phone }: RegisterDto,
  ) {
    return await hash(password, await genSaltSync(10, 'a')).then(
      async (hashPass) =>
        this.authService.signUp({
          username,
          password: hashPass,
          firstName,
          lastName,
          email,
          phone,
        }),
    );
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('sign-in')
  async signIn(@Body() { username, password }: UserSignInDto) {
    return await this.authService.login({ username, password });
  }

  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtModule)
  @Post('change-pass')
  async changePass(
    @Body() { password, old_password, uid }: ChangePassDto,
  ): Promise<any> {
    if (isEmpty(password) || password.length < 5 || password !== old_password) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.PASSWORD_ERROR', {
            lang: 'en',
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password.length < 5) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.MINIMUM_LENGTH_PASSWORD', {
            lang: 'en',
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await hash(password, await genSaltSync(10, 'a')).then(
      async (hashPass) => this.authService.changePass(uid, hashPass),
    );
  }
}
