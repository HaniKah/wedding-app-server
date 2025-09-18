import { Injectable } from '@nestjs/common';
import { PlacesClient } from '@googlemaps/places';
import { google } from '@googlemaps/places/build/protos/protos';
import IPlace = google.maps.places.v1.IPlace;
import IGetPhotoMediaRequest = google.maps.places.v1.IGetPhotoMediaRequest;

@Injectable()
export class GoogleApiService {
  private readonly client = new PlacesClient({
    apiKey: process.env.GOOGLE_API_KEY || '',
  });

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

  // const url = `https://places.googleapis.com/v1/${photoRef}/media?key=${process.env.GOOGLE_API_KEY}&maxHeightPx=450&skipHttpRedirect=true`;
  //
  // const res = await fetch(url);
  //
  // if (!res.ok) {
  //   throw new Error(`Failed to fetch photo: ${res.status} ${res.statusText}`);
  // }
  //
  // const json = (await res.json()) as { name: string; photoUri: string };
  // return json.photoUri || '';
}
