import { Injectable } from '@nestjs/common';
import {
  PlaceDetailsDto,
  PlacesDto,
  PlacesViewModel,
} from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { PlannerRepositoryService } from './planner.repository.service';
import { Places } from 'kysely-codegen';
import { Selectable } from 'kysely';

@Injectable()
export class PlannerService {
  constructor(
    private readonly plannerRepositoryService: PlannerRepositoryService,
  ) {}

  public async getPlaces(step: WeddingSteps): Promise<PlacesViewModel> {
    const placesRecord: Selectable<Places>[] =
      await this.plannerRepositoryService.getAllPlaces(step);
    const places = this.createPlacesDto(placesRecord);

    return { places };
  }

  // public async getPlaceDetails(placeId: number): Promise<PlaceDetailsDto> {
  //   const record :Selectable<PlacesDe> this.plannerRepositoryService.getPlaceDetails(placeId);
  // }

  // public async getPhotos(photoRef: string): Promise<PhotosDto> {
  //   // if we store images, we can mix images with google places api
  // }

  public async getPlaceById(id: number): Promise<PlaceDetailsDto> {
    const record: Selectable<Places> =
      await this.plannerRepositoryService.getPlaceById(id);
    return {
      id: record?.id,
      name: record.name,
      address: record.streetName,
      phoneNumber: record.phoneNumber,
      website: record.website,
    };
  }

  private createPlacesDto(record: Selectable<Places>[]): PlacesDto[] {
    return record.map((r) => {
      return {
        placeId: r.id,
        name: r.name,
        formattedAddress: r.streetName,
      };
    });
  }
}
