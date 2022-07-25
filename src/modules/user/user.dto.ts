import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

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

export class QueryUserDto {
  @ApiProperty({
    required: false,
  })
  username?: string;

  @ApiProperty({
    required: false,
  })
  @ApiProperty()
  skip: number;

  @ApiProperty({
    required: false,
  })
  @ApiProperty()
  take: number;
}
