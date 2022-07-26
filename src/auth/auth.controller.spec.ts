import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Profile } from '../entities/profile';
import { User } from '../entities/user';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  const configService = new ConfigService();

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.register({ folder: './config' }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          name: 'default',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_NAME'),
          entities: [User, Profile],
          synchronize: true,
          logging: false,
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

    // service = app.get(SftpService); // In that case I got the same error as in main test
  });

  beforeEach(async () => {
    const userRepository = getRepository(User);
    const profileRepository = getRepository(Profile);
    const jwtService = new JwtService();
    authService = new AuthService(
      userRepository,
      profileRepository,
      jwtService,
    );
    authController = new AuthController(authService);
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
      const id = '18';

      jest.spyOn(authService, 'signUp').mockImplementation(() => result);
      expect(
        await authController.changePass({
          password,
          old_password,
          uid: id,
        }),
      ).toBe(undefined);
    });
  });
});
