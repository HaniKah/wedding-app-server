import { Inject, Injectable } from '@nestjs/common';
import { google } from '@googlemaps/places/build/protos/protos';
import type { ConfigType } from '@nestjs/config';
import googleApiConfig from './config/google-api.config';
import { PlacesClient } from '@googlemaps/places';
import IPlace = google.maps.places.v1.IPlace;
import IGetPhotoMediaRequest = google.maps.places.v1.IGetPhotoMediaRequest;

@Injectable()
export class GoogleApiService {
  private readonly client = new PlacesClient();
  constructor(
    @Inject(googleApiConfig.KEY)
    private googleApi: ConfigType<typeof googleApiConfig>,
  ) {
    this.client = new PlacesClient({
      key: this.googleApi.apiKey,
    });
  }

  async getPhotoByRef(photoRef: string): Promise<string> {
    const photoMediaName = photoRef + '/media';
    // Construct the Place Photos request
    const getPhotoMediaRequest: IGetPhotoMediaRequest = {
      name: photoMediaName,
      maxHeightPx: 450,
      skipHttpRedirect: true,
    };

    const [photoMediaResponse] =
      await this.client.getPhotoMedia(getPhotoMediaRequest);
    return photoMediaResponse.photoUri || '';
  }

  public async getPlaceById(
    placeId: string,
  ): Promise<IPlace | undefined | null> {
    const fieldMask = [
      'displayName',
      'formattedAddress',
      'internationalPhoneNumber',
      'nationalPhoneNumber',
      'rating',
      'photos',
    ];
    const request = {
      name: `places/${placeId}`,
    };
    const callOptions = {
      otherArgs: {
        headers: {
          'X-Goog-FieldMask': fieldMask,
        },
      },
    };
    const [place] = await this.client.getPlace(request, callOptions);
    return place;
  }

  private async getPlaces(query: string): Promise<IPlace[] | null | undefined> {
    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.rating',
    ];
    const request = {
      textQuery: query,
      // locationBias: locationBias,
      // minRating: minRating,
      // openNow: true,
      // priceLevels: priceLevels,
    };

    const callOptions = {
      otherArgs: {
        headers: {
          'X-Goog-FieldMask': fieldMask,
        },
      },
    };
    const [response] = await this.client.searchText(request, callOptions);
    return response.places;
  }
}
