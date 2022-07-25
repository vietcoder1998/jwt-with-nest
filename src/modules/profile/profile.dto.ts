import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePassDto {
  @ApiProperty({
    type: 'string',
    default: '',
    required: true,
  })
  uid: string;

  @ApiProperty({
    type: 'string',
    default: '',
    required: true,
  })
  password: string;

  @ApiProperty({
    type: 'string',
    default: '',
    required: true,
  })
  old_password: string;
}

export class UpdateProfileDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;
}
