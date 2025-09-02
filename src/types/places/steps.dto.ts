import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StepsDto {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  currentStep: WeddingSteps;
  @ApiProperty({ enum: WeddingSteps, isArray: true, enumName: 'WeddingSteps' })
  steps: WeddingSteps[];
}
