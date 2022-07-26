import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async findOne(pid: string): Promise<any> {
    console.log(pid);
    const profile = await this.profilesRepository.findOne({
      id: pid,
    });

    if (!profile) {
      throw new HttpException(
        {
          message: 'USER_NOTFOUND',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return profile;
  }
}
