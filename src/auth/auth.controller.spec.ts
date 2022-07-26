import { faker } from '@faker-js/faker';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepository, getConnection } from 'typeorm';
import { Profile } from '../entities/profile';
import { User } from '../entities/user';
import { AuthController } from './auth.controller';
import { Test } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService = new JwtService();
  const configService = new ConfigService();

  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.register({ folder: './config' }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          name: configService.get('CONNECTION_NAME'),
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_NAME'),
          entities: [User, Profile],
          synchronize: true,
          logging: false,
        }),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        },
      ],
    }).compile();

    const userRepository = getRepository(
      User,
      configService.get('CONNECTION_NAME'),
    );
    const profileRepository = getRepository(
      Profile,
      configService.get('CONNECTION_NAME'),
    );
    jwtService = new JwtService();
    authService = new AuthService(
      userRepository,
      profileRepository,
      jwtService,
    );
    authController = new AuthController(authService);
  });

  afterEach(async () => {
    await getConnection(configService.get('CONNECTION_NAME')).close();
  });

  describe('Sign In', () => {
    it('Success in sign in', async () => {
      let result;

      jest.spyOn(authService, 'login').mockImplementation(() => result);
      expect(
        await authController.signIn({
          username: 'hello_world',
          password: '1234567',
        }),
      ).toBe(result);
    });
  });

  describe('Sign Up', () => {
    it('Success in sign up', async () => {
      let result;

      jest.spyOn(authService, 'signUp').mockImplementation(() => result);
      expect(
        await authController.signUp({
          username: faker.internet.userName(),
          password: faker.internet.password(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
        }),
      ).toBe(result);
    });
  });

  describe('Change password', () => {
    it('Success in change pass', async () => {
      let result;
      const password = faker.internet.password();
      const old_password = password;
      const id = '9';

      jest.spyOn(authService, 'changePass').mockImplementation(() => result);
      expect(
        await authController.changePass({
          password,
          old_password,
          uid: id,
        }),
      ).toBe(result);
    });
  });
});
