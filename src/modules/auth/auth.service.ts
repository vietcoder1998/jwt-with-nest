import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile';
import { User } from '../../entities/user';
import { RegisterDto } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    private readonly i18n: I18nService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    { firstName, lastName, email, phone, username, password }: RegisterDto,
    lang?: string,
  ): Promise<any> {
    const checkExistUser = await this.usersRepository.findOne({
      username,
    });
    const emailProfile = await this.profileRepository.findOne({ email });

    if (checkExistUser) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.USERNAME_DUPLICATE', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (emailProfile) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.EMAIL_INVALID', {
            lang: lang,
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const profile = await this.profileRepository.save({
      phone,
      email,
      first_name: firstName,
      last_name: lastName,
    });

    const user = new User();
    user.username = username;

    user.password = password;
    user.profile = profile;
    const result = await this.usersRepository.save(user);

    return {
      ...result,
    };
  }

  async validateToken(uid: any, token: string, lang?: string) {
    const payload = { uid, token };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne(
      {
        username,
      },
      {
        relations: ['profile'],
      },
    );

    console.log(user);

    if (!user) {
      throw new HttpException(
        {
          message: await this.i18n.translate('global.USER_INVALID', {
            lang: 'en',
          }),
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const comparPw = await compare(password, user.password);

      if (!comparPw) {
        throw new HttpException(
          {
            message: await this.i18n.translate('global.USER_INVALID', {
              lang: 'en',
            }),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = {
        ...user.profile,
      };

      delete response.id;

      return response;
    }
  }
}
