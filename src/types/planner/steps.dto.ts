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

  @ApiProperty({
    type: () => FullfilledStep || Date,
    nullable: true,
  })
  fullfilled: FullfilledStep | Date | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
export class FullfilledStep {
  @ApiProperty()
  placeId: string;
  @ApiProperty()
  placeName: string;
}
