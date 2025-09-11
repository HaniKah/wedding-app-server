import { Injectable } from '@nestjs/common';
import { PlaceDetailsDto, PlacesDto, PlacesViewModel, } from '../types/planner/places.dto';
import { GoogleApiService } from '../google-api/google-api.service';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { PhotosDto } from '../types/planner/photos.dto';

@Injectable()
export class PlannerService {
  constructor(private readonly googleApiService: GoogleApiService) {}

  public async getPlaces(step: WeddingSteps): Promise<PlacesViewModel> {
    const res: PlacesDto[] = await this.googleApiService.getPlaces(
      'nearby' + step,
    );
    return { result: res };
  }

  public async getPlaceDetails(placeId: string): Promise<PlaceDetailsDto> {
    return await this.googleApiService.getPlaceById(placeId);
  }

  public async getPhotos(photoRef: string): Promise<PhotosDto> {
    // if we store images, we can mix images with google places api
    return await this.googleApiService.getPhotoByRef(photoRef);
  }
}
