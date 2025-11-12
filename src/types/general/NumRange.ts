import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a numeric range ( postgres numrange ) with string values.
 */
export class NumRange {
  @ApiProperty()
  min: string | null;
  @ApiProperty()
  max: string | null;
}
