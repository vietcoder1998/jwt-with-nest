import { Body, Controller, Headers, Post, Request } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterDto, UserSignInDto } from './auth.dto';
import { AuthService } from './auth.service';
import { hash, genSaltSync } from 'bcrypt';
@Controller('auth')
@ApiTags('Authenticate')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiBody({
    schema: {
      type: 'object',
      default: {
        username: 'hello_world',
        password: '123456',
        email: 'abc@gmail.com',
        phone: '008888888',
        firstName: 'Hello ',
        lastName: 'World',
      },
    },
  })
  async signUp(
    @Headers('x-lang') lang: string,
    @Body()
    { username, password, firstName, lastName, email, phone }: RegisterDto,
    @Request()
    req: any,
  ) {
    return await hash(password, await genSaltSync(10, 'a')).then(
      async (hashPass) =>
        this.authService.signUp(
          { username, password: hashPass, firstName, lastName, email, phone },
          lang,
        ),
    );
  }

  @Post('sign-in')
  async signIn(
    @Body() { username, password }: UserSignInDto,
    @Request() req: any,
  ) {
    return await this.authService.validateUser(username, password);
  }
}
