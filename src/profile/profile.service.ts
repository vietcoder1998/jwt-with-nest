import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile';
import { Http } from 'src/helpers/http';
import { Utils } from 'src/helpers/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async findOne(pid: string, lang?: string): Promise<any> {
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

  async changeEmail(uid: string, email: string, lang) {
    // valid email
    if (Utils.isEmpty(uid)) {
      throw new HttpException(
        {
          message: 'EMAIL_EMPTY',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Utils.validateEmail(email)) {
      throw new HttpException(
        {
          message: 'EMAIL_NOT_VALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // check email exist
    const checkExist = await this.profilesRepository.findOne({
      email,
    });

    if (checkExist) {
      throw new HttpException(
        {
          message: 'EMAIL_EXISTS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const profile = await this.profilesRepository.findOne({
      id: uid,
    });

    if (!profile) {
      throw new HttpException(
        {
          message: 'EMAIL_EXISTS',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const result = await this.profilesRepository.update(uid, { email });

      if (result) {
        return Http.responseMessage('UPDATE_SUCCESS');
      } else {
        //return Http.responseError('Error update info.');
        throw new HttpException(
          {
            message: 'UPDATE_INFO_FAIL',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
