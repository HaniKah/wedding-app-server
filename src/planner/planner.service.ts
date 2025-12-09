import { Injectable } from '@nestjs/common';
import {
  PlaceDetailsDto,
  PlaceDetailsRequest,
  PlacesViewModel,
  SearchFilter,
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
import { PlannerRepositoryService } from './planner.repository.service';
import { stepsInfo } from '../constants/steps-info';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';

@Injectable()
export class PlannerService {
  constructor(
    private readonly placeDetailsRepositoryService: PlaceDetailsRepositoryService,
    private readonly plansRepositoryService: PlansRepositoryService,
    private readonly placesRepositoryService: PlannerRepositoryService,
    private readonly photosService: PhotosService,
  ) {}

  public async updateWeddingDate(userId: number, date: Date): Promise<void> {
    const planRecord =
      await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);
    await this.plansRepositoryService.updatePlan(planRecord.id, {
      weddingDate: date,
    });
  }

  public async getWeddingDate(userId: number): Promise<WeddingDateDto> {
    const planRecord =
      await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);
    return {
      date: planRecord?.weddingDate?.toLocaleDateString('en-CA') || null,
    };
  }

  public async updateAPlaceDetails(
    userId: number,
    request: PlaceDetailsRequest,
  ): Promise<void> {
    if (request.picked) {
      const planRecord =
        await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);
      await this.placeDetailsRepositoryService.removeAllPicked(
        planRecord.id,
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
          notes: request.notes,
        },
      );
    } else {
      const planRecord =
        await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);

      //todo optimization: here we are updating unnecessary fields
      await this.placeDetailsRepositoryService.createPlaceDetails({
        planId: planRecord.id,
        placeId: request.placeId,
        step: request.step,
        picked: request.picked,
        favourite: request.favorite,
      });
    }
  }

  public async getPlaces(
    userId: number,
    step: WeddingSteps,
    searchQuery?: string,
    filter?: SearchFilter,
  ): Promise<PlacesViewModel> {
    const placesAndPlaceDetailsRecord =
      await this.placesRepositoryService.getAllPlaces(
        userId,
        step,
        searchQuery,
        filter,
      );

    const list = await Promise.all(
      placesAndPlaceDetailsRecord.map(async (r) => {
        const mainPhoto: string =
          await this.photosService.getMainPhotoOrFirstByPlaceId(
            r.id,
            PhotoSize.Small,
          );

        return {
          id: r.id,
          step: step,
          name: r.name,
          formattedAddress: r.streetName,
          picked: r.picked,
          favourite: r.favourite,
          mainPhoto: mainPhoto,
        };
      }),
    );

    return { places: list, filter: filter };
  }

  public async getPlaceById(id: number): Promise<PlaceDetailsDto> {
    const place = await this.placesRepositoryService.getPlaceByIdOrThrow(id);
    const details =
      await this.placeDetailsRepositoryService.getPlaceDetailsByPlaceId(id);

    const mainPhoto: string =
      await this.photosService.getMainPhotoOrFirstByPlaceId(
        place.id,
        PhotoSize.Small,
      );

    return {
      id: place.id,
      name: place.name,
      address: `${place.streetName}, ${place.city}, ${place.country}`,
      phoneNumber: place?.phoneNumber,
      website: place?.website,
      facebook: place?.facebook,
      instagram: place?.instagram,
      tiktok: place?.tiktok,
      currency: place.currency,
      step: place.step as WeddingSteps,
      picked: details?.picked || false,
      favourite: details?.favourite || false,
      notes: details?.notes || null,
      mainPhoto: mainPhoto,
    };
  }

  public async getSteps(userId: number): Promise<StepsViewModel> {
    //todo : ignored steps are not implemented yet
    const stepsList: WeddingSteps[] = Object.values(WeddingSteps);
    const planRecord =
      await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);
    const completedStepsRecord =
      await this.placeDetailsRepositoryService.getPlaceDetailsOfCompletedSteps(
        planRecord.id,
      );

    let note: string;

    const dtoList = await Promise.all(
      stepsList.map(async (step) => {
        let isCompleted: boolean = false;
        const pickedPlace = completedStepsRecord.find((s) => s.step === step);
        if (pickedPlace && pickedPlace.placeId) {
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

  public async createChecklist(userId: number): Promise<ChecklistViewModel> {
    //todo : ignored steps are not implemented yet
    const stepsList: WeddingSteps[] = Object.values(WeddingSteps);
    const planRecord =
      await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);

    const completedStepsRecord =
      await this.placeDetailsRepositoryService.getPlaceDetailsOfCompletedSteps(
        planRecord.id,
      );

    let placeName: string | null = null;
    let placeId: number | null = null;

    const dtoList: ChecklistDto[] = await Promise.all(
      stepsList.map(async (step) => {
        let isCompleted: boolean = false;

        const found = completedStepsRecord.find((s) => s.step === step);

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
