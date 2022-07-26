import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from '../logger/index';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  private logger: LoggerService = new LoggerService();

  constructor(
    private profileService: ProfileService,
    private i18n: I18nService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'pid',
    description: 'profile id',
  })
  @Get('/:pid')
  async profile(
    @Headers('x-lang') lang: string,
    @Param('pid') pid: string,
  ): Promise<any> {
    return await this.profileService.findOne(pid, lang);
  }
}
