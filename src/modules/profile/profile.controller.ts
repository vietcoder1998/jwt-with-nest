import { Controller, Get, Headers, Request, UseGuards } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from '../../logger/index';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  private logger: LoggerService = new LoggerService();

  constructor(
    private profileService: ProfileService,
    private i18n: I18nService,
  ) {}

  @UseGuards(JwtModule)
  @Get()
  async profile(
    @Headers('Authorization') authToken: string,
    @Headers('x-lang') lang: string,
    @Request() req,
  ): Promise<any> {
    const profileInfo = req.profile;

    return await this.profileService.findOne(profileInfo, lang);
  }
}
