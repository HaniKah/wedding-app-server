import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '../general/categories';

export class StepsViewModel {
  @ApiProperty()
  progress: number;
  @ApiProperty({ type: () => [StepsDto] })
  steps: StepsDto[];
}
export class StepsDto {
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;

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
  @ApiProperty({ enum: Categories, enumName: 'WeddingSteps' })
  step: Categories;
  isCompleted: boolean;
  placeName: string | null;
  placeId: number | null;
}
export class ChecklistViewModel {
  list: ChecklistDto[];
}
