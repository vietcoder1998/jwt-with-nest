import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Http } from '../../helpers/http';

import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { User } from '../../entities/user';
import { Utils } from '../../helpers/utils';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private i18n: I18nService,
  ) {}

  async findOne(uid: string, lang?: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      id: uid,
    });

    if (!user) {
      throw new HttpException(
        {
          message: await this.i18n.translate('user.USER_NOTFOUND', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async changePass(uid: string, password: string, lang: string): Promise<any> {
    const user = this.usersRepository.findOne(uid);
    if (!user) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.GET_TOKEN_FAIL', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
