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
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { jwtConstants } from '../auth/constants';

describe('ProfileController', () => {
  let profileService: ProfileService;
  let profileController: ProfileController;
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
        ProfileService,
        JwtService,
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    const profileRepository = getRepository(
      Profile,
      configService.get('CONNECTION_NAME'),
    );
    profileService = new ProfileService(profileRepository);
    profileController = new ProfileController(profileService);
  });

  afterEach(async () => {
    await getConnection(configService.get('CONNECTION_NAME')).close();
  });

  describe('Find Profile', () => {
    it('Find Profile', async () => {
      let result;
      const pid = '15';

      jest.spyOn(profileController, 'profile').mockImplementation(() => result);
      expect(await profileController.profile(pid)).toBe(result);
    });
  });
});
