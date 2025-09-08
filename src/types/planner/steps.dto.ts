import { ApiProperty } from '@nestjs/swagger';
import { WeddingSteps } from '../general/wedding-steps-enum.dto';

export class StepsDto {
  @ApiProperty()
  progress: number;
  @ApiProperty({ type: () => [StepInfo] })
  steps: StepInfo[];
}
export class StepInfo {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;

  @ApiProperty()
  fullfilled: boolean;

  @ApiProperty()
  note: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
