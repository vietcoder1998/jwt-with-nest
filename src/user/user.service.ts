import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Like, Repository } from 'typeorm';
import { User } from '../entities/user';
import { isEmpty } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private i18n: I18nService,
  ) {}

  async findOne(uid: string, lang?: string): Promise<any> {
    const user = await this.userRepository.findOne({
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

  async find(skip: number, take: number, username: string) {
    const result = await this.userRepository.find({
      relations: ['profile'],
      skip: (skip ?? 0) * (take ?? 10),
      take: take ?? 10,
    });

    const response = result.map((item) => ({
      id: item.id,
      username: item.username,
    }));

    return response;
  }
}
