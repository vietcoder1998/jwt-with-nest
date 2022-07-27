import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

//
import {
  getConnectionToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { getConnection, Repository, Connection } from 'typeorm';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { jwtConstants } from '../src/auth/constants';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { Profile } from '../src/entities/profile';
import { User } from '../src/entities/user';
import { UserService } from '../src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

jest.useFakeTimers();

describe('AuthAction (e2e)', () => {
  let app: INestApplication;
  const configService = new ConfigService();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register({ folder: '../src/config' }),
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
        UserService,
        JwtService,
        AuthService,
        {
          provide: getConnectionToken(configService.get('CONNECTION_NAME')),
          useClass: Connection,
        },
        {
          provide: getRepositoryToken(
            User,
            configService.get('CONNECTION_NAME'),
          ),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(
            Profile,
            configService.get('CONNECTION_NAME'),
          ),
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.init();
  });

  describe('Authentication', () => {
    let jwtToken: string;

    describe('Login', () => {
      it('authenticates user with valid credentials and provides a jwt token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'hello_world', password: '123456' })
          .expect(200);

        // set jwt token for use in subsequent tests
        jwtToken = response.body.access_token;
        expect(jwtToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        ); // jwt regex
      });

      it('fails to authenticate user with an incorrect password', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'hello_world', password: 'wrong' })
          .expect(401);

        expect(response.body.access_token).not.toBeDefined();
      });

      it('fails to authenticate user that does not exist', async () => {
        jest.useFakeTimers();

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'by_world', password: 'test' })
          .expect(401);

        expect(response.body.access_token).not.toBeDefined();
      });
    });

    describe('Protected', () => {
      it('gets protected resource with jwt authenticated request', async () => {
        const response = await request(app.getHttpServer())
          .get('/protected')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        const data = response.body.data;
        // add assertions that reflect your test data
        // expect(data).toHaveLength(3)
      });
    });
  });

  afterEach(async () => {
    await getConnection(configService.get('CONNECTION_NAME')).close();
    await app.close();
  });
});
