import { Injectable } from '@nestjs/common';
import {
  PlaceDetailsDto,
  PlacesDto,
  PlacesViewModel,
} from '../types/planner/places.dto';
import { GoogleApiService } from '../google-api/google-api.service';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { PhotosDto } from '../types/planner/photos.dto';

@Injectable()
export class PlannerService {
  private readonly activateGoogle: boolean = false;
  constructor(private readonly googleApiService: GoogleApiService) {}

  public async getPlaces(step: WeddingSteps): Promise<PlacesViewModel> {
    let googlePlaces: PlacesDto[] = [];

    if (this.activateGoogle) {
      googlePlaces = await this.googleApiService.getPlaces('nearby ' + step);
    }
    // now here you can fetch places from database and add it to the ViewModel

    return { googlePlaces: googlePlaces };
  }

  public async getPlaceDetails(placeId: string): Promise<PlaceDetailsDto> {
    return await this.googleApiService.getPlaceById(placeId);
  }

  public async getPhotos(photoRef: string): Promise<PhotosDto> {
    // if we store images, we can mix images with google places api
    return await this.googleApiService.getPhotoByRef(photoRef);
  }
}
