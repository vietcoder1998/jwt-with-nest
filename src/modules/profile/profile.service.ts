import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Http } from '../../helpers/http';

import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile';
import { Utils } from '../../helpers/utils';
import { UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,

    private i18n: I18nService,
  ) {}

  async findOne(uid: string, lang?: string): Promise<any> {
    const profile = await this.profilesRepository.findOne({
      id: uid,
    });

    if (!profile) {
      throw new HttpException(
        {
          message: await this.i18n.translate('profile.USER_NOTFOUND', {
            lang: lang,
          }),
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
          message: await this.i18n.translate('global.EMAIL_EMPTY', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Utils.validateEmail(email)) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.EMAIL_NOT_VALID', {
            lang: lang,
          }),
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
          message: await this.i18n.translate('global.EMAIL_EXISTS', {
            lang: lang,
          }),
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
          message: await this.i18n.translate('global.EMAIL_EXISTS', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const result = await this.profilesRepository.update(uid, { email });

      if (result) {
        return Http.responseMessage(
          await this.i18n.translate('global.UPDATE_SUCCESS', { lang: lang }),
        );
      } else {
        //return Http.responseError('Error update info.');
        throw new HttpException(
          {
            message: await this.i18n.translate('global.UPDATE_INFO_FAIL', {
              lang: lang,
            }),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
