import { Injectable } from '@nestjs/common';
import { PlaceDetailsDto, PlacesViewModel } from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { PlannerRepositoryService } from './planner.repository.service';

@Injectable()
export class PlannerService {
  constructor(
    private readonly plannerRepositoryService: PlannerRepositoryService,
  ) {}

  public async getPlaces(step: WeddingSteps): Promise<PlacesViewModel> {
    const placesRecord = await this.plannerRepositoryService.getAllPlaces(step);
    const list = placesRecord.map((r) => {
      return {
        id: r.id,
        name: r.name,
        formattedAddress: r.streetName,
      };
    });
    return { places: list };
  }

  public async getPlaceById(id: number): Promise<PlaceDetailsDto> {
    const record = await this.plannerRepositoryService.getPlaceByIdOrThrow(id);
    return {
      id: record.id,
      name: record.name,
      address: `${record.streetName}, ${record.city}, ${record.country}`,
      phoneNumber: record?.phoneNumber,
      website: record?.website,
    };
  }

  // public async getPlaceDetails(placeId: number): Promise<PlaceDetailsDto> {
  //   const record :Selectable<PlacesDe> this.plannerRepositoryService.getPlaceDetails(placeId);
  // }

  // public async getPhotos(photoRef: string): Promise<PhotosDto> {
  //   // if we store images, we can mix images with google places api
  // }

  // public async getSteps(): Promise<StepsViewModel> {
  //   const steps: Promise<StepsDto[]> = Object.values(WeddingSteps).map(
  //     async (v) => {
  //       const details = await this.plannerRepositoryService.getDetailsByStep(v);
  //       const isCompleted = details?.find((d) => d.picked == true);
  //       return {
  //         title: stepsInfo[v].title,
  //         description: stepsInfo[v].description,
  //         step: v,
  //         isCompleted: !!isCompleted,
  //         note: 'you can do it',
  //       };
  //     },
  //   );
  //   return {
  //     progress: 3.4,
  //     steps: await steps,
  //   };
  // }
}
