import {
  HttpException,
  HttpStatus,
  Injectable, 
  NestMiddleware
} from '@nestjs/common';
import axios from 'axios';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private i18n: I18nService) {}

  async use(req: any, res: any, next: () => void) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    const lang = req.get('x-lang') || 'en';

    const userInfo = await axios
      .get(process.env.URL_GET_USER_INFO, {
        headers: { Authorization: accessToken },
      })
      .then((info) => {
        if (info.data.success === true) {
          return info.data.result;
        } else {
          return info.data;
        }
      })
      .catch(async (err) => {
        //console.log('Error userinfo', err.response);
        return err.response
          ? err.response.data
          : {
              errors: [
                {
                  code: 400,
                  message: await this.i18n.translate('global.GET_INFO_FAIL', {
                    lang: lang,
                  }),
                },
              ],
            };
      });

    //console.log('userInfo', userInfo);
    if (typeof userInfo.error !== 'undefined') {
      if (userInfo.error.message_code == 'invalid_or_expired_auth_token') {
        throw new HttpException(
          { message: userInfo.error.message },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          { message: userInfo.error.message },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (typeof userInfo.userId === 'undefined') {
      //console.log('==========> error', userInfo);
      throw new HttpException(
        {
          message: await this.i18n.translate('global.USER_NOT_FOUND', {
            lang: lang,
          }),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    req.user = userInfo;
    next();
  }
}
