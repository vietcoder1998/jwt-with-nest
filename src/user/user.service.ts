import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(uid: string): Promise<any> {
    const user = await this.userRepository.findOne({
      id: uid,
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'USER_NOTFOUND',
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
