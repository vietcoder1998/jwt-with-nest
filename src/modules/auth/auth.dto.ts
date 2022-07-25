import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class UserCheckDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  user_id: string;
}

export class UserSignInDto {
  @ApiProperty({
    type: 'string',
    default: 'hello',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    default: '123456',
  })
  password: string;
}

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  lastName: string;

  @IsString()
  firstName: string;

  @IsString()
  password: string;
}

export class UserValidateDto {
  @IsString()
  uid: string;

  @IsString()
  token: string;
}
