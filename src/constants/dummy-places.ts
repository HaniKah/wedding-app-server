import { WeddingSteps } from '../places/places.types';

export function dummyPlaces(step: WeddingSteps) {
  return new Promise((resolve) => {
    if (step === WeddingSteps.Host) {
      return resolve(dummyData.host);
    }
    if (step === WeddingSteps.Photographer) {
      return resolve(dummyData.photoghraphers);
    }
    if (step === WeddingSteps.Dress) {
      return resolve(dummyData.dress);
    }
  });
}

const dummyData = {
  dress: {
    result: [
      {
        placeId: 'ChIJ339uDaihHBURZ2mgtOTMtVM',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9925027,
          lng: 35.8642499,
        },
        name: 'dress Dress dress',
        formatted_address: 'Wasfi At-Tall St. 179, Amman, Jordan',
      },
      {
        placeId: 'ChIJx-QIaj2gHBURlw4ZmuM-k7c',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9838239,
          lng: 35.8922951,
        },
        name: 'Allaialy halls',
        formatted_address: 'Amman, Jordan',
      },
      {
        placeId: 'ChIJa8ae9aWgHBUR3nTttATsbhs',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9205057,
          lng: 35.9085818,
        },
        name: 'Sinokrot Halls',
        formatted_address:
          'Kutkut Halls Saleh Hasan Al, Ahmad Qadri St. 13،, Amman, Jordan',
      },
    ],
  },
  host: {
    result: [
      {
        placeId: 'ChIJ51i9R_pfGxUR7vY7QzR16FA',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9550446,
          lng: 35.9897994,
        },
        name: 'Host host host',
        formatted_address: 'Hizam Ring Rd, Amman, Jordan',
      },
      {
        placeId: 'ChIJv256m3ZfGxURHxgNRBgzRqk',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9242879,
          lng: 35.9320666,
        },
        name: 'صالة قصر الليدي ماريا',
        formatted_address: 'WWFJ+PR8, Khawlah Bent Al-Azwar St., Amman, Jordan',
      },
      {
        placeId: 'ChIJa5QpFuahHBUROLJSTmIyxmM',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9640033,
          lng: 35.8715177,
        },
        name: 'قاعات الزبن للمناسبات (Al Zaben Hall)',
        formatted_address: '11941 Amman, Jordan',
      },
      {
        placeId: 'ChIJ2_7Xac6hHBURXxU-muAGGxw',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9923832,
          lng: 35.8648011,
        },
        name: 'Numan Halls',
        formatted_address: 'Wasfi At-Tall St. 178, Amman, Jordan',
      },
      {
        placeId: 'ChIJUWchtjinHBUR1O5WExYGDaw',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9014718,
          lng: 35.8920711,
        },
        name: 'قاعات البطيخي للأفراح',
        formatted_address: 'Amman, Jordan',
      },
      {
        placeId: 'ChIJU3Bac2ahHBURQFlCXy0_KfM',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.8638094,
          lng: 35.8944297,
        },
        name: 'White Hall',
        formatted_address: 'Airport Rd., Amman 11732, Jordan',
      },
      {
        placeId: 'ChIJj5n6_t-nHBURkMD14xW8zPk',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.845643,
          lng: 35.881152,
        },
        name: 'Bebek Halls',
        formatted_address: 'Unnamed Road, Jordan',
      },
      {
        placeId: 'ChIJ72UuFnygHBUR64IHtlROXN4',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.873054,
          lng: 35.8821665,
        },
        name: 'Eden Garden',
        formatted_address: 'Airport Rd., Amman, Jordan',
      },
      {
        placeId: 'ChIJn684QJipHBUR--LuhmuxsOI',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.7954411,
          lng: 35.8979881,
        },
        name: 'The Hall venue',
        formatted_address: 'QVWX+55, Amman, Jordan',
      },
      {
        placeId: 'ChIJf3fmTRqgHBURxxqgP_Vud50',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9846994,
          lng: 35.9003689,
        },
        name: 'قاعات عمان الكبرى',
        formatted_address: 'Amman, Jordan',
      },
    ],
  },
  photoghraphers: {
    result: [
      {
        placeId: 'ChIJZ39NHK6gHBURbg0Pyu7jwEo',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9176041,
          lng: 35.9045213,
        },
        name: 'Photographer Photographer',
        formatted_address:
          'WW93+3R5 Al Skafi Commercial Complex, Al-Quds St. 356, Amman, Jordan',
      },
      {
        placeId: 'ChIJIwSHOMFeGxUR8EdskzkYwI8',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9040717,
          lng: 35.9762511,
        },
        name: 'Asayel palace wedding venue',
        formatted_address: 'Amman, Jordan',
      },
      {
        placeId: 'ChIJDWAgOPZhGxURHJvOszX683Y',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9934265,
          lng: 35.9565062,
        },
        name: 'بيت معان',
        formatted_address: 'XXV4+M93, Amman, Jordan',
      },
      {
        placeId: 'ChIJO8YOaktnGxURIlZAX5N8mTg',
        businessStatus: 'OPERATIONAL',
        location: {
          lat: 31.9773291,
          lng: 36.0122456,
        },
        name: 'قصر الزهراء للافراح',
        formatted_address: 'Hizam Ring Rd, Amman 11140, Jordan',
      },
    ],
  },
};
