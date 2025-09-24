import { ApiProperty } from '@nestjs/swagger';

export class WeddingDateDto {
  @ApiProperty({ type: String })
  date: string | null;
}
export class UpdateDateRequest {
  @ApiProperty()
  date: string;
}
