import { Body, Controller, Get, Post } from '@nestjs/common';
import { GuestsService } from './guests.service';
import {
  AddGuestRequest,
  DeleteGuestRequest,
  GuestsViewModel,
  UpdateGuestRequest,
} from '../types/guests/guests.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}
  @Get('getGuests')
  public async getGuests(): Promise<GuestsViewModel> {
    return { result: await this.guestsService.getGuests() };
  }

  @Post('addGuest')
  public async addGuest(@Body() request: AddGuestRequest): Promise<void> {
    await this.guestsService.addGuest(request);
  }

  @Post('updateGuest')
  public async updateGuest(@Body() request: UpdateGuestRequest): Promise<void> {
    await this.guestsService.updateGuest(request);
  }

  @Post('deleteGuest')
  public async deleteGuest(@Body() request: DeleteGuestRequest): Promise<void> {
    await this.guestsService.deleteGuest(request);
  }
}
