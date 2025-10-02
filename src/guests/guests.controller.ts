import { Body, Controller, Get, Post } from '@nestjs/common';
import { GuestsService } from './guests.service';
import {
  AddGuestRequest,
  GuestsDto,
  UpdateGuestRequest,
} from '../types/guests/guests.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}
  @Get('getGuests')
  public async getGuests(): Promise<GuestsDto[]> {
    return await this.guestsService.getGuests();
  }

  @Post('addGuest')
  public async addGuest(@Body() request: AddGuestRequest): Promise<void> {
    await this.guestsService.addGuest(request);
  }

  @Post('updateGuest')
  public async updateGuest(@Body() request: UpdateGuestRequest): Promise<void> {
    await this.guestsService.updateGuest(request);
  }
}
