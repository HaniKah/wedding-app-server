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
}
