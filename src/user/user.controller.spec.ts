import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

describe('AuthController', () => {
  let userController: UserController;
  let userService: UserService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    // service = app.get(SftpService); // In that case I got the same error as in main test
  });

  beforeEach(async () => {
    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('SignIn', () => {
    describe('With True Account', () => {
      it('Error in login', async () => {
        let result;

        jest.spyOn(userController, 'find').mockImplementation(() => result);
        expect(await userController.find).toBe(result);
      });
    });

    describe('with Error UserName', () => {
      it('Error in login', async () => {
        const finder = userController.find({
          username: '',
          skip: 0,
          take: 10,
        });
      });
    });

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
