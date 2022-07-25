import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { I18nService } from 'nestjs-i18n';
import { getRepository } from 'typeorm';
import { User } from 'src/entities/user';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    userRepository = getRepository(User);
    userRepository = getRepository(User);
    i18nService = new I18nService();
    authService = new AuthService(userRepository);
    authController = new AuthController(authService, i18nService);
  });

  describe('login', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(authService, 'sign-in').mockImplementation(() => result);

      expect(await authController.findAll()).toBe(result);
    });
  });
});
