import { Injectable } from '@nestjs/common';
import { GuestsRepositoryService } from './guests.repository.service';
import {
  AddGuestRequest,
  DeleteGuestRequest,
  GuestsDto,
  UpdateGuestRequest,
} from '../types/guests/guests.dto';

@Injectable()
export class GuestsService {
  private readonly userId = 1;
  constructor(
    private readonly guestsRepositoryService: GuestsRepositoryService,
  ) {}

  public async getGuests(): Promise<GuestsDto[]> {
    const guestsRecord = await this.guestsRepositoryService.getAllGuests(
      this.userId,
    );
    return guestsRecord.map((r) => {
      return {
        id: r.id,
        name: r.name,
        coupleSide: r.coupleSide,
        isInvited: r.isInvited,
        phoneNumber: r.phoneNumber,
      };
    });
  }

  public async addGuest(r: AddGuestRequest): Promise<void> {
    await this.guestsRepositoryService.createGuest({
      userId: this.userId,
      ...r,
    });
  }
  public async updateGuest(r: UpdateGuestRequest): Promise<void> {
    await this.guestsRepositoryService.updateGuest(this.userId, r);
  }
  public async deleteGuest(r: DeleteGuestRequest): Promise<void> {
    await this.guestsRepositoryService.deleteGuest(r.id);
  }
}
