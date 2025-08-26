import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import PlaceResult = google.maps.places.PlaceResult;

@Injectable()
export class GoogleApiService {
  async getPlaces(query: string): Promise<PlaceResult> {
    const res: PlaceResult = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${query}=` +
        query +
        `&key=${process.env.GOOGLE_API_KEY}`,
    );

    return res;
  }
}
