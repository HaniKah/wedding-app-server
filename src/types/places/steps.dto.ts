import { ApiProperty } from '@nestjs/swagger';
import { WeddingSteps } from '../general/wedding-steps-enum.dto';

export class StepsDto {
  @ApiProperty()
  fullfilled: boolean;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
}
