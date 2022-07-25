import { ApiProperty } from '@nestjs/swagger';

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
