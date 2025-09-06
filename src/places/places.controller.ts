import { Controller, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { PlacesViewModel } from '../types/places/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { dummyPlaces } from '../constants/dummy-places';
import { dummySteps } from '../constants/dummy-steps';
import { StepsDto } from '../types/places/steps.dto';

@ApiExtraModels(StepsDto)
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('getGooglePlaces')
  public getGooglePlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return this.placesService.getGooglePlaces(step);
  }

  // this is created to avoid overload google api with requests while testing
  @Get('getPlaces')
  public async getPlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return await dummyPlaces(step);
  }
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: Object.values(WeddingSteps).reduce(
        (acc, step) => {
          acc[step] = { $ref: getSchemaPath(StepsDto) };
          return acc;
        },
        {} as Record<string, any>,
      ),
      required: Object.values(WeddingSteps),
    },
  })
  @Get('getSteps')
  public async getSteps(): Promise<Record<WeddingSteps, StepsDto>> {
    return dummySteps();
  }
}
