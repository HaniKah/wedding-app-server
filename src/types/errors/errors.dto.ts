import { ApiProperty } from '@nestjs/swagger';

export class ErrorsDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string | string[];

  @ApiProperty()
  error: string;
}
