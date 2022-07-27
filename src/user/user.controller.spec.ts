import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Profile } from '../entities/profile';
import { User } from '../entities/user';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { jwtConstants } from '../auth/constants';

describe('UserController', () => {
  let userService: UserService;
  let userController: UserController;
  const configService = new ConfigService();

  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.register({ folder: '../config' }),
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
    userService = new UserService(userRepository);
    userController = new UserController(userService);
  });

  afterEach(async () => {
    await getConnection(configService.get('CONNECTION_NAME')).close();
  });

  describe('Find User', () => {
    it('fail in find user', async () => {
      let result;

      jest.spyOn(userService, 'find').mockImplementation(() => result);
      expect(
        await userController.find({
          skip: 0,
          take: 10,
        }),
      ).toBe(result);
    });
  });
});
