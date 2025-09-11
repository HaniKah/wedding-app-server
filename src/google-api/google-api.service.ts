import { Injectable } from '@nestjs/common';
import {
  PlaceDetailsDto,
  PlacePhotoDto,
  PlacesDto,
} from '../types/planner/places.dto';
import {
  Client,
  FindPlaceFromTextResponse,
  Place,
  PlaceInputType,
  PlacePhoto,
} from '@googlemaps/google-maps-services-js';
import { LatLng } from '../types/general/latlng.dto';
import { PhotosDto } from '../types/planner/photos.dto';

@Injectable()
export class GoogleApiService {
  private readonly client = new Client();

  async getPhotoByRef(photoRef: string): Promise<PhotosDto> {
    return await this.fetchGooglePlacePhotoByRef(photoRef);
  }

  public async getPlaceById(placeId: string): Promise<PlaceDetailsDto> {
    const res: Place = await this.fetchGooglePlaceDetailsById(placeId);
    let photos: PlacePhotoDto[] = [];
    if (res.photos) {
      photos = res.photos?.map((p: PlacePhoto) => {
        return {
          photoRef: p.photo_reference,
          width: p.width,
          height: p.height,
          attributions: p.html_attributions,
        };
      });
    }
    return {
      placeId: placeId,
      name: res.name ? res.name : null,
      website: res.website ? res.website : null,
      formattedAddress: res.formatted_address ? res.formatted_address : null,
      formattedPhoneNumber: res.formatted_phone_number
        ? res.formatted_phone_number
        : null,
      internationalNumber: res.international_phone_number
        ? res.international_phone_number
        : null,
      rating: res.rating ? res.rating : null,
      userRatingCount: res.user_ratings_total ? res.user_ratings_total : null,
      photos: photos,
    };
  }

  public async getPlaces(query: string): Promise<PlacesDto[]> {
    const googlePlace: Place[] = await this.fetchGooglePlaces(query);
    return googlePlace.map((p: Place) => {
      return {
        placeId: p.place_id ? p.place_id : null,
        businessStatus: p.business_status,
        location: new LatLng(
          p.geometry?.location.lat,
          p.geometry?.location.lng,
        ),
        name: p.name,
        formatted_address: p.formatted_address,
        formatted_phone_number: p.formatted_phone_number,
      };
    });
  }

  private async fetchGooglePlaceDetailsById(placeId: string): Promise<Place> {
    const res = await this.client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_API_KEY || '',
        fields: [
          'displayName',
          'formattedAddress',
          'formattedPhoneNumber',
          'internationalPhoneNumber',
          'rating',
          'userRatingCount',
          'photos',
        ],
      },
    });
    return res.data.result;
  }

  private async fetchGooglePlaces(query: string): Promise<Place[]> {
    const res: FindPlaceFromTextResponse = await this.client.findPlaceFromText({
      params: {
        inputtype: PlaceInputType.textQuery,
        input: query,
        key: process.env.GOOGLE_API_KEY || '',
        fields: [
          'displayName',
          'formattedAddress',
          'internationalPhoneNumber',
          'nationalPhoneNumber',
          'rating',
          'userRatingCount',
          'photos',
        ],
      },
    });
    return res.data.candidates;
  }
  private async fetchGooglePlacePhotoByRef(
    photoRef: string,
  ): Promise<PhotosDto> {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.GOOGLE_API_KEY}`;
    const res: Response = await fetch(url);
    const json = (await res.json()) as { name: string; photoUri: string };
    return {
      name: json.name,
      uri: json.photoUri,
    };
  }
}
