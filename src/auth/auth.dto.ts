import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserCheckDto {
  @ApiProperty()
  username: string;

  @IsEmail()
  email: string;

  @ApiProperty()
  user_id: string;
}

export class UserSignInDto {
  @ApiProperty({
    type: 'string',
    default: 'hello_world',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    default: '123456',
  })
  password: string;
}

export class RegisterDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  password: string;
}

export class UserValidateDto {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  token: string;
}

export class ChangePassDto {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  old_password: string;
}

export class UpdateUserDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;
}

export class PayloadDto {
  @IsString()
  password?: string;

  @IsString()
  username: string;

  @IsString()
  uid: string;
}
