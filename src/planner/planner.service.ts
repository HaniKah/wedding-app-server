import { Injectable } from '@nestjs/common';
import { PlaceDetailsDto, PlacesViewModel } from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { PlannerRepositoryService } from './planner.repository.service';
import { StepsDto, StepsViewModel } from '../types/planner/stepsViewModel';
import { stepsInfo } from '../constants/steps-info';

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

  public async getSteps(): Promise<StepsViewModel> {
    const stepsList: WeddingSteps[] = Object.values(WeddingSteps);

    const completedSteps =
      await this.plannerRepositoryService.getCompletedSteps();

    const completedStepsList: WeddingSteps[] = completedSteps.map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (s) => s.step,
    ) as WeddingSteps[];

    const steps: StepsDto[] = await Promise.all(
      stepsList.map(async (step) => {
        const isCompleted: boolean = completedStepsList.includes(step);
        return {
          step,
          title: stepsInfo[step].title,
          description: stepsInfo[step].description,
          isCompleted,
          note: await this.createStepNote(isCompleted, step),
        };
      }),
    );
    return {
      progress: 3.4,
      steps: steps,
    };
  }

  private async createStepNote(
    isCompleted: boolean,
    step: WeddingSteps,
  ): Promise<string> {
    if (isCompleted) {
      const details =
        await this.plannerRepositoryService.getDetailsOfCompletedStep(step);
      if (details?.placeId) {
        const place = await this.plannerRepositoryService.getPlaceByIdOrThrow(
          details.placeId,
        );
        return place.name;
      }
      if (details?.googleId) {
        return 'name should be fetched from google';
      }
    }

    return this.generateRandomNote();
  }

  private generateRandomNote() {
    // create custom notes here and randomly pick one of them
    return ' you can do it';
  }

  // public async getPhotos(photoRef: string): Promise<PhotosDto> {
  //   // if we store images, we can mix images with google places api
  // }
}
