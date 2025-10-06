import { ApiProperty } from '@nestjs/swagger';

export enum CoupleSide {
  Groom = 'Groom',
  Bride = 'Bride',
}

export class GuestsDto {
  id: number;
  name: string;
  phoneNumber: string;
  @ApiProperty({ enum: CoupleSide, enumName: 'CoupleSide' })
  coupleSide: CoupleSide;
  isInvited: boolean;
}

export class AddGuestRequest {
  name: string;
  phoneNumber: string;
  @ApiProperty({ enum: CoupleSide, enumName: 'CoupleSide' })
  coupleSide: CoupleSide;
}

export class UpdateGuestRequest {
  id: number;
  name?: string;
  phoneNumber?: string;
  @ApiProperty({ enum: CoupleSide, enumName: 'CoupleSide' })
  coupleSide?: CoupleSide;
}

export class GuestsViewModel {
  result: GuestsDto[];
}
