import { Injectable } from '@nestjs/common';
import {
  PlaceDetailsDto,
  PlacePhotoDto,
  PlacesDto,
} from '../types/planner/places.dto';

import { LatLng } from '../types/general/latlng.dto';
import { PhotosDto } from '../types/planner/photos.dto';
import { PlacesClient } from '@googlemaps/places';
import { google } from '@googlemaps/places/build/protos/protos';
import IPlace = google.maps.places.v1.IPlace;

@Injectable()
export class GoogleApiService {
  private readonly client = new PlacesClient({
    apiKey: process.env.GOOGLE_API_KEY || '',
  });

  async getPhotoByRef(photoRef: string): Promise<PhotosDto> {
    return await this.fetchGooglePlacePhotoByRef(photoRef);
  }

  public async getPlaceById(placeId: string): Promise<PlaceDetailsDto> {
    const res: IPlace | undefined | null =
      await this.fetchGooglePlaceDetailsById(placeId);
    let photos: PlacePhotoDto[] = [];
    if (res?.photos) {
      photos = res?.photos?.map((p) => {
        return {
          photoRef: p.name ? p.name : null,
          width: p.widthPx ? p.widthPx : null,
          height: p.heightPx ? p.heightPx : null,
          attributions: p.authorAttributions ? p.authorAttributions : null, //this is an array ,we defined excatly the object fields that is coming from google , thats way we are note looping over the array and defining the values again , because i am too lazy to do that , and google sucks
        };
      });
    }
    return {
      placeId: placeId,
      name: res?.displayName?.text ? res?.displayName?.text : null,
      website: res?.websiteUri ? res.websiteUri : null,
      formattedAddress: res?.formattedAddress ? res.formattedAddress : null,
      internationalPhoneNumber: res?.internationalPhoneNumber
        ? res.internationalPhoneNumber
        : null,
      nationalPhoneNumber: res?.nationalPhoneNumber
        ? res.nationalPhoneNumber
        : null,
      rating: res?.rating ? res.rating : null,
      userRatingCount: res?.userRatingCount ? res.userRatingCount : null,
      photos: photos,
    };
  }

  public async getPlaces(query: string): Promise<PlacesDto[]> {
    const googlePlace: IPlace[] | undefined | null =
      await this.fetchGooglePlaces(query);
    if (!googlePlace) return [];
    return googlePlace?.map((p) => {
      return {
        placeId: p.id ? p.id : null,
        location: new LatLng(
          p.location?.latitude ? p.location.latitude : null,
          p.location?.latitude ? p.location.longitude : null,
        ),
        name: p.name ? p.name : null,
        formattedAddress: p.formattedAddress ? p.formattedAddress : null,
        internationalPhoneNumber: p.internationalPhoneNumber
          ? p.internationalPhoneNumber
          : null,
      };
    });
  }

  private async fetchGooglePlaceDetailsById(
    placeId: string,
  ): Promise<IPlace | undefined | null> {
    const fieldMask = [
      'displayName',
      'formattedAddress',
      'internationalPhoneNumber',
      'nationalPhoneNumber',
      'rating',
      'userRatingCount',
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

  private async fetchGooglePlaces(
    query: string,
  ): Promise<IPlace[] | null | undefined> {
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
  private async fetchGooglePlacePhotoByRef(
    photoRef: string,
  ): Promise<PhotosDto> {
    const url = `https://places.googleapis.com/v1/${photoRef}/media?key=${process.env.GOOGLE_API_KEY}&maxHeightPx=400&skipHttpRedirect=true`;
    const res: Response = await fetch(url);
    const json = (await res.json()) as { name: string; photoUri: string };
    return {
      uri: json.photoUri,
    };
  }
}
