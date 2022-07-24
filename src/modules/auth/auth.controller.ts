import { Controller, Headers, Post, Request } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signIn')
  async signIn(@Headers('x-lang') lang: string, @Request() req: any) {
    return await this.authService.signUp(req.user, lang);
  }

  @Post('signUp')
  async signUp(@Headers('x-lang') lang: string, @Request() req: any) {
    return await this.authService.signIn(req.user, lang);
  }
}
