import { ApiProperty } from '@nestjs/swagger';
import { WeddingSteps } from '../general/wedding-steps-enum.dto';

export class StepsViewModel {
  @ApiProperty()
  progress: number;
  @ApiProperty({ type: () => [StepsDto] })
  steps: StepsDto[];
}
export class StepsDto {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;

  @ApiProperty()
  isCompleted: boolean;

  @ApiProperty()
  note: string; // the place name or the date

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export interface StepsInfo {
  title: string;
  description: string;
}

export class ChecklistDto {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
  isCompleted: boolean;
  placeName: string | null;
  placeId: number | null;
  cost: number | null;
}
export class ChecklistViewModel {
  list: ChecklistDto[];
}
