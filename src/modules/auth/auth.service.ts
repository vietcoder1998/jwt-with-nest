import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile';
import { User } from '../../entities/user';
import { UserService } from '../user/user.service';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    private readonly i18n: I18nService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    { firstName, lastName, email, phone, username, password }: RegisterDto,
    lang?: string,
  ): Promise<any> {
    const emailProfile = await this.usersRepository.findOne({ username });
    const userUserName = await this.profileRepository.findOne({ email });

    if (userUserName) {
      throw new HttpException(
        {
          message: await this.i18n.translate('User exited', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (emailProfile) {
      throw new HttpException(
        {
          message: await this.i18n.translate('Email exited', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepository.save({ username, password });
    const profile = await this.profileRepository.save({
      phone,
      email,
      firstName,
      lastName,
    });

    return {
      uid: user.id,
      ...profile,
    };
  }

  async signIn(user: any, lang?: string) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
