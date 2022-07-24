import { IsString } from 'class-validator';

export class ChangePassDto {
  @IsString()
  password: string;

  @IsString()
  old_password: string;
}

export class UpdateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
