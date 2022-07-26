import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile';
import { User } from '../entities/user';
import { RegisterDto, UserSignInDto } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    private jwtService: JwtService,
  ) {}

  async signUp({
    firstName,
    lastName,
    email,
    phone,
    username,
    password,
  }: RegisterDto): Promise<any> {
    const checkExistUser = await this.userRepository.findOne({
      username,
    });
    const emailProfile = await this.profileRepository.findOne({ email });

    if (checkExistUser) {
      throw new HttpException(
        {
          message: 'USERNAME_DUPLICATE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (emailProfile) {
      throw new HttpException(
        {
          message: 'USERNAME_DUPLICATE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const profile = await this.profileRepository.save({
      phone,
      email,
      first_name: firstName,
      last_name: lastName,
      full_name: [firstName, lastName].join(' '),
    });

    const user = new User();
    user.username = username;

    user.password = password;
    user.profile = profile;
    const result = await this.userRepository.save(user);

    return {
      ...result,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.userRepository.findOne(
      {
        username,
      },
      { relations: ['profile'] },
    );

    if (!user) {
      throw new HttpException(
        {
          message: 'USERNAME_OR_PASSWORD_ERROR',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const comparPw = await compare(password, user.password);

      if (!comparPw) {
        throw new HttpException(
          {
            message: 'USERNAME_OR_PASSWORD_ERROR',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    }
  }

  async changePass(uid: string, password: string): Promise<any> {
    const user = this.userRepository.findOne(uid);
    if (!user) {
      throw new HttpException(
        {
          message: 'GET_TOKEN_FAIL',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return await this.userRepository.update({ id: uid }, { password });
    }
  }

  async login({ username, password }: UserSignInDto) {
    const user = await this.validateUser(username, password);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      access_token: this.jwtService.sign({ username, password, uid: user.id }),
      uid: user.id,
      pid: user.profile.id,
    };
  }
}
