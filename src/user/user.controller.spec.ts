import { JwtService } from '@nestjs/jwt';
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

describe('UserController', () => {
  let userService: UserService;
  let userController: UserController;

  beforeAll(async () => {
    const configService = new ConfigService();
    await Test.createTestingModule({
      imports: [
        ConfigModule.register({ folder: '../config' }),
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

    const userRepository = getRepository(User);
    userService = new UserService(userRepository);
    userController = new UserController(userService);
  });

  afterAll(async () => {
    getConnection('default').close();
  })

  describe('Find User', () => {
    it('Find', async () => {
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
