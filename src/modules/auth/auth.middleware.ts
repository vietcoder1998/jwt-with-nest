import { Injectable, NestMiddleware } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private i18n: I18nService) {}

  async use(req: any, res: any, next: () => void) {
    next();
  }
}
