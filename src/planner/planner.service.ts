import { Injectable } from '@nestjs/common';
import {
  PlaceDetailsDto,
  PlaceDetailsRequest,
  PlacesViewModel,
} from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { PlannerRepositoryService } from './planner.repository.service';
import { StepsDto, StepsViewModel } from '../types/planner/steps.dto';
import { stepsInfo } from '../constants/steps-info';
import { WeddingDateDto } from '../types/planner/weddingDateDto';

@Injectable()
export class PlannerService {
  private readonly planId: number = 1;
  constructor(
    private readonly plannerRepositoryService: PlannerRepositoryService,
  ) {}

  public async updateWeddingDate(date: Date): Promise<void> {
    await this.plannerRepositoryService.updateWeddingDate(this.planId, date);
  }

  public async getWeddingDate(): Promise<WeddingDateDto> {
    const plan = await this.plannerRepositoryService.getPlanByIdOrThrow(
      this.planId,
    );
    return {
      date: plan?.weddingDate?.toLocaleDateString('en-CA') || null,
    };
  }

  public async updateAPlaceDetails(
    request: PlaceDetailsRequest,
  ): Promise<void> {
    await this.plannerRepositoryService.updatePlaceDetails(
      this.planId,
      request,
    );
  }

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
    const place = await this.plannerRepositoryService.getPlaceByIdOrThrow(id);
    const details =
      await this.plannerRepositoryService.getPlaceDetailsByPlaceId(id);

    return {
      id: place.id,
      name: place.name,
      address: `${place.streetName}, ${place.city}, ${place.country}`,
      phoneNumber: place?.phoneNumber,
      website: place?.website,
      minCost: place.minCost,
      maxCost: place.maxCost,
      cost: place.cost,
      step: place.step as WeddingSteps,
      picked: details?.picked || false,
      favourite: details?.favourite || false,
      notes: details?.notes || null,
    };
  }

  public async getSteps(): Promise<StepsViewModel> {
    //todo : ignored steps are not implemented yet
    const stepsList: WeddingSteps[] = Object.values(WeddingSteps);

    const completedSteps =
      await this.plannerRepositoryService.getCompletedSteps(this.planId);

    const completedStepsList: WeddingSteps[] = completedSteps.map(
      (s) => s.step as WeddingSteps,
    );

    const progress: number =
      Math.floor((completedStepsList.length / stepsList.length) * 100) / 100;

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
      progress: progress,
      steps: steps,
    };
  }

  private async createStepNote(
    isCompleted: boolean,
    step: WeddingSteps,
  ): Promise<string> {
    if (isCompleted) {
      const details =
        await this.plannerRepositoryService.getPlaceDetailsOfCompletedStep(
          step,
          this.planId,
        );
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
}
