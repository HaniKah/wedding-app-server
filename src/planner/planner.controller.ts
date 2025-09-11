import { Controller, Get, Query } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlaceDetailsDto, PlacesViewModel } from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { dummyPlaces } from '../constants/dummy-places';
import { dummySteps } from '../constants/dummy-steps';
import { StepsDto } from '../types/planner/steps.dto';
import { PhotosDto } from '../types/planner/photos.dto';

@Controller('places')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Get('getPlaces')
  public getPlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    console.log('step is :' + step);
    return this.plannerService.getPlaces(step);
  }

  @Get('getPlaceById')
  public async getPlaceById(
    @Query('placeId') placeId: string,
  ): Promise<PlaceDetailsDto> {
    return await this.plannerService.getPlaceDetails(placeId);
  }

  @Get('getPhotoByRef')
  public async getPhotoByRef(
    @Query('photoRef') photoRef: string,
  ): Promise<PhotosDto> {
    return await this.plannerService.getPhotos(photoRef);
  }

  // this is created to avoid overload google api with requests while testing
  @Get('getDummyPlaces')
  public async getDummyPlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return await dummyPlaces(step);
  }

  @Get('getDummySteps')
  public async getDummySteps(): Promise<StepsDto> {
    return dummySteps();
  }
}
