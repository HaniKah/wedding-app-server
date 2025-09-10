import { Injectable } from '@nestjs/common';
import { GooglePlacesResponse } from '../types/planner/places.dto';

@Injectable()
export class GoogleApiService {
  constructor() {}

  async getPlaces(query: string): Promise<GooglePlacesResponse> {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_API_KEY}`;

    const response: Response = await fetch(url);

    return (await response.json()) as GooglePlacesResponse;
  }

  async getPlaceById(placeId: string): Promise<unknown> {
    const fields: string =
      'displayName,formattedAddress,internationalPhoneNumber,nationalPhoneNumber,rating,userRatingCount';
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${process.env.GOOGLE_API_KEY}`;
    const response: Response = await fetch(url);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await response.json();
    console.log('result from google : ', result);
    return result;
  }
}
