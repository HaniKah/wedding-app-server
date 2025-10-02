export class GuestsDto {
  id: number;
  name: string;
  phoneNumber: string;
  coupleSide: CoupleSide;
  isInvited: boolean;
}

export enum CoupleSide {
  Groom = 'Groom',
  Bride = 'Bride',
}

export class AddGuestRequest {
  name: string;
  phoneNumber: string;
  coupleSide: CoupleSide;
}

export class UpdateGuestRequest {
  name?: string;
  phoneNumber?: string;
  coupleSide?: CoupleSide;
}
