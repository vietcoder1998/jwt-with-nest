import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../logger/index';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'pid',
    description: 'profile id',
  })
  @Get('/:pid')
  async profile(@Param('pid') pid: string): Promise<any> {
    return await this.profileService.findOne(pid);
  }
}
