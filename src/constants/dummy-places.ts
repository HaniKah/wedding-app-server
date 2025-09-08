import { LatLng } from '../types/general/latlng.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { PlacesViewModel } from '../types/planner/places.dto';

export async function dummyPlaces(
  step: WeddingSteps,
): Promise<PlacesViewModel> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (step === WeddingSteps.Date) return { result: [] };
  if (step === WeddingSteps.Host) return dummyData.host;
  if (step === WeddingSteps.Photographer) return dummyData.photographers;
  if (step === WeddingSteps.Dress) return dummyData.dress;
  if (step === WeddingSteps.Dj) return dummyData.dj;
  return { result: [] };
}

const dummyData = {
  dj: {
    result: [
      {
        placeId: 'ChIJ339uDaihHBURZ2mgtOTMtVM',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9925027, 35.8642499),
        name: 'dj dj dj',
        formatted_address: 'Wasfi At-Tall St. 179, Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
    ],
  },
  dress: {
    result: [
      {
        placeId: 'ChIJx-QIaj2gHBURlw4ZmuM-k7c',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        lat: 31.9838239,
        name: 'dress dress dress',
        formatted_address: 'Amman, Jordan',
        formatted_phone_number: undefined,
      },
      {
        placeId: 'ChIJa8ae9aWgHBUR3nTttATsbhs',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'Sinokrot Halls',
        formatted_address:
          'Kutkut Halls Saleh Hasan Al, Ahmad Qadri St. 13،, Amman, Jordan',
        formatted_phone_number: undefined,
      },
    ],
  },
  host: {
    result: [
      {
        placeId: 'ChIJ51i9R_pfGxUR7vY7QzR16FA',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'Host host host',
        formatted_address: 'Hizam Ring Rd, Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
      {
        placeId: 'ChIJv256m3ZfGxURHxgNRBgzRqk',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'صالة قصر الليدي ماريا',
        formatted_address: 'WWFJ+PR8, Khawlah Bent Al-Azwar St., Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
      {
        placeId: 'ChIJ72UuFnygHBUR64IHtlROXN4',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'Eden Garden',
        formatted_address: 'Airport Rd., Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
      {
        placeId: 'ChIJn684QJipHBUR--LuhmuxsOI',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'The Hall venue',
        formatted_address: 'QVWX+55, Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
      {
        placeId: 'ChIJf3fmTRqgHBURxxqgP_Vud50',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'قاعات عمان الكبرى',
        formatted_address: 'Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
    ],
  },
  photographers: {
    result: [
      {
        placeId: 'ChIJZ39NHK6gHBURbg0Pyu7jwEo',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'Photographer Photographer',
        formatted_address:
          'WW93+3R5 Al Skafi Commercial Complex, Al-Quds St. 356, Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
      {
        placeId: 'ChIJIwSHOMFeGxUR8EdskzkYwI8',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'Asayel palace wedding venue',
        formatted_address: 'Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
      {
        placeId: 'ChIJDWAgOPZhGxURHJvOszX683Y',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'بيت معان',
        formatted_address: 'XXV4+M93, Amman, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
      {
        placeId: 'ChIJO8YOaktnGxURIlZAX5N8mTg',
        businessStatus: 'OPERATIONAL',
        location: new LatLng(31.9838239, 35.8922951),
        name: 'قصر الزهراء للافراح',
        formatted_address: 'Hizam Ring Rd, Amman 11140, Jordan',
        formatted_phone_number: '+962 7 777 7777',
      },
    ],
  },
};
