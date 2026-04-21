import { ApiProperty } from '@nestjs/swagger';

export enum Timeframe {
  Year = 'Year',
  NineMonths = 'NineMonths',
  SixMonths = 'SixMonths',
  ThreeMonths = 'ThreeMonths',
  OneMonth = 'OneMonth',
  LastWeek = 'LastWeek',
  LastDay = 'LastDay',
  BigDay = 'BigDay',
}

export class ChecklistDto {
  id: number;
  task: string;
  isChecked: boolean;
  @ApiProperty({ enum: Timeframe, enumName: 'Timeframe' })
  timeframe: Timeframe;
}

export class CreateTaskRequest {
  task: string;
  @ApiProperty({ enum: Timeframe, enumName: 'Timeframe' })
  timeframe: Timeframe;
}

export class ChecklistViewModel {
  result: ChecklistDto[];
}

export class DeleteTaskRequest {
  taskId: number;
}

export class ToggleTaskRequest {
  taskId: number;
}
