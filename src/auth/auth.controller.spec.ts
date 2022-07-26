import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    // service = app.get(SftpService); // In that case I got the same error as in main test
  });

  beforeEach(async () => {
    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('SignIn', () => {
    describe('With True Account', () => {
      it('Error in login', async () => {
        let result;

        jest
          .spyOn(authService, 'login')
          .mockImplementation(({ username, password }) => result);

        expect(await authController.signIn).toBe(result);
      });
    });

    // describe('with Error UserName', () => {
    //   it('Error in login', async () => {
    //     const signInAction = jest.spyOn(authController, 'signIn');
    //     const signIn = authController.signIn({
    //       username: 'hello_world',
    //       password: '1234567',
    //     });

    //     expect(signInAction).toHaveProperty(['access_token', 'pid', 'uid']);
    //     expect(signIn).toBe(true);

    //     signInAction.mockReset();
    //     signInAction.mockRestore();
    //   });
    // });

    // describe('with Error Password', () => {
    //   it('Error in login', async () => {
    //     let result;

    //     jest
    //       .spyOn(authController, 'signIn')
    //       .mockImplementation(({ username, password }) => result);

    //     expect(await authController.signIn).toBe(result);
    //   });
    // });
  });

  // describe('SignUp', () => {
  //   describe('', () => {
  //     it('Error in login', async () => {
  //       let result;

  //       jest
  //         .spyOn(authController, 'signIn')
  //         .mockImplementation(({ username, password }) => result);

  //       expect(await authController.signIn).toBe(result);
  //     });
  //   });

  //   describe('login', () => {
  //     it('Error in login', async () => {
  //       let result;

  //       jest
  //         .spyOn(authController, 'signIn')
  //         .mockImplementation(({ username, password }) => result);

  //       expect(await authController.signIn).toBe(result);
  //     });
  //   });

  //   describe('login', () => {
  //     it('Error in login', async () => {
  //       let result;

  //       jest
  //         .spyOn(authController, 'signIn')
  //         .mockImplementation(({ username, password }) => result);

  //       expect(await authController.signIn).toBe(result);
  //     });
  //   });
  // });

  // describe('ChangePass', () => {
  //   describe('', () => {
  //     it('Error in login', async () => {
  //       let result;

  //       jest
  //         .spyOn(authController, 'signIn')
  //         .mockImplementation(({ username, password }) => result);

  //       expect(await authController.signIn).toBe(result);
  //     });
  //   });

  //   describe('login', () => {
  //     it('Error in login', async () => {
  //       let result;

  //       jest
  //         .spyOn(authController, 'signIn')
  //         .mockImplementation(({ username, password }) => result);

  //       expect(await authController.signIn).toBe(result);
  //     });
  //   });

  //   describe('login', () => {
  //     it('Error in login', async () => {
  //       let result;

  //       jest
  //         .spyOn(authController, 'signIn')
  //         .mockImplementation(({ username, password }) => result);

  //       expect(await authController.signIn).toBe(result);
  //     });
  //   });
  // });
});
