import { Injectable, NestMiddleware } from '@nestjs/common';
import * as chalk from 'chalk';
import { LoggerService } from './logger/index';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: LoggerService = new LoggerService();
  //logger = new Logger('HTTP');
  log = (...args) => this.logger.log(chalk.magenta(...args));

  use(req: any, _res: any, next: () => void) {
    const { method, body } = req;
    const { statusCode, statusMessage } = _res;
    const userAgent = req.get('user-agent') || '';
    //const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    let message = 'Request Url: ' + req.originalUrl + '\n';
    message += 'Method: ' + method + '\n';
    message += 'User Agent: ' + userAgent + '\n';
    message += 'Body: ' + JSON.stringify(body) + '\n';
    message += 'IP: ' + req.get('X-Forwarded-For') + '\n';
    message += 'Response Status: ' + statusCode + '\n';

    this.logger.log(message);
    next();
  }
}
