import { Injectable } from '@nestjs/common';
import {
  PlaceDetailsDto,
  PlaceDetailsRequest,
  PlacesViewModel,
} from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import {
  ChecklistDto,
  ChecklistViewModel,
  StepsViewModel,
} from '../types/planner/steps.dto';
import { WeddingDateDto } from '../types/planner/weddingDateDto';
import { PlansRepositoryService } from './plans.repository.service';
import { PlaceDetailsRepositoryService } from './place-details.repository.service';
import { PlacesRepositoryService } from './places.repository.service';
import { stepsInfo } from '../constants/steps-info';

@Injectable()
export class PlannerService {
  private readonly planId: number = 1;

  constructor(
    private readonly placeDetailsRepositoryService: PlaceDetailsRepositoryService,
    private readonly plansRepositoryService: PlansRepositoryService,
    private readonly placesRepositoryService: PlacesRepositoryService,
  ) {}

  public async updateWeddingDate(date: Date): Promise<void> {
    await this.plansRepositoryService.updatePlan(this.planId, {
      weddingDate: date,
    });
  }

  public async getWeddingDate(): Promise<WeddingDateDto> {
    const plan = await this.plansRepositoryService.getPlanByIdOrThrow(
      this.planId,
    );
    return {
      date: plan?.weddingDate?.toLocaleDateString('en-CA') || null,
    };
  }

  public async updateAPlaceDetails(
    request: PlaceDetailsRequest,
  ): Promise<void> {
    if (request.picked) {
      await this.placeDetailsRepositoryService.removeAllPicked(
        this.planId,
        request.step,
      );
    }
    const details =
      await this.placeDetailsRepositoryService.getPlaceDetailsByPlaceId(
        request.placeId,
      );
    if (details) {
      //todo optimization: here we are updating unnecessary fields
      await this.placeDetailsRepositoryService.updatePlaceDetailsById(
        details.id,
        {
          step: request.step,
          picked: request.picked,
          cost: request.cost,
          notes: request.notes,
        },
      );
    } else {
      //todo optimization: here we are updating unnecessary fields
      await this.placeDetailsRepositoryService.createPlaceDetails({
        planId: this.planId,
        placeId: request.placeId,
        step: request.step,
        picked: request.picked,
        favourite: request.favorite,
        cost: request.cost,
      });
    }
  }

  public async getPlaces(step: WeddingSteps): Promise<PlacesViewModel> {
    const placesRecord = await this.placesRepositoryService.getAllPlaces(step);
    const list = placesRecord.map((r) => {
      return {
        id: r.id,
        step: step,
        name: r.name,
        formattedAddress: r.streetName,
      };
    });
    return { places: list };
  }

  public async getPlaceById(id: number): Promise<PlaceDetailsDto> {
    const place = await this.placesRepositoryService.getPlaceByIdOrThrow(id);
    const details =
      await this.placeDetailsRepositoryService.getPlaceDetailsByPlaceId(id);

    return {
      id: place.id,
      name: place.name,
      address: `${place.streetName}, ${place.city}, ${place.country}`,
      phoneNumber: place?.phoneNumber,
      website: place?.website,
      facebook: place?.facebook,
      instagram: place?.instagram,
      tiktok: place?.tiktok,
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

    const completedStepsRecord =
      await this.placeDetailsRepositoryService.getPlaceDetailsOfCompletedSteps(
        this.planId,
      );

    const weddingDate = await this.getWeddingDate();
    let note: string;

    const dtoList = await Promise.all(
      stepsList.map(async (step) => {
        let isCompleted: boolean = false;
        const pickedPlace = completedStepsRecord.find((s) => s.step === step);
        if (step === WeddingSteps.Date && weddingDate.date) {
          note = weddingDate.date;
          isCompleted = true;
        } else if (pickedPlace && pickedPlace.placeId) {
          const placeDetails = await this.getPlaceById(pickedPlace.placeId);
          note = placeDetails.name;
          isCompleted = true;
        } else {
          note = this.generateRandomNote();
        }
        return {
          step,
          title: stepsInfo[step].title,
          description: stepsInfo[step].description,
          isCompleted: isCompleted,
          note: note,
        };
      }),
    );

    return {
      steps: dtoList,
      progress:
        Math.floor((completedStepsRecord.length / stepsList.length) * 100) /
        100,
    };
  }

  public async createChecklist(): Promise<ChecklistViewModel> {
    //todo : ignored steps are not implemented yet
    const stepsList: WeddingSteps[] = Object.values(WeddingSteps);

    const completedStepsRecord =
      await this.placeDetailsRepositoryService.getPlaceDetailsOfCompletedSteps(
        this.planId,
      );

    const weddingDate: WeddingDateDto = await this.getWeddingDate();

    let placeName: string | null = null;
    let placeId: number | null = null;

    const dtoList: ChecklistDto[] = await Promise.all(
      stepsList.map(async (step) => {
        let isCompleted: boolean = false;

        const found = completedStepsRecord.find((s) => s.step === step);

        if (step === WeddingSteps.Date) {
          isCompleted = weddingDate.date !== null;
          placeName = weddingDate.date;
        }

        if (found && found.placeId) {
          const placeDetails = await this.getPlaceById(found.placeId);
          placeName = placeDetails.name;
          placeId = found.placeId;
          isCompleted = true;
        }

        return {
          step,
          isCompleted: isCompleted,
          placeName: placeName,
          placeId: placeId,
          cost: found?.cost || null,
        };
      }),
    );

    return {
      list: dtoList,
    };
  }

  private generateRandomNote() {
    // create custom notes here and randomly pick one of them
    return ' you can do it';
  }
}
