import { PlacesViewModel } from '../../../types/planner/places.dto';
import { WeddingSteps } from '../../../types/general/wedding-steps-enum.dto';
import { Role } from '../../../types/auth/auth.dto';
import { CountryCode } from '../../../types/general/countries.dto';
import { PriceType } from '../../../types/places/places.dto';

export const placesViewModelStub = (): PlacesViewModel => {
  return {
    places: [
      {
        id: 123,
        name: 'sample Cars',
        currency: 'JOD',
        favourite: true,
        step: WeddingSteps.Dress,
        isPromoted: false,
        label: null,
        mainPhoto: 'https://placehold.co/600x400',
        maxPrice: '250',
        minPrice: '50',
        picked: false,
        phoneNumber: '0795542743',
        priceType: PriceType.None,
        city: 'Amman',
        formattedAddress:
          'sample address , sample city , sample state , sample country',
      },
    ],
    filter: null,
  };
};

export const getPlaceRequestStub = () => ({
  loggedInUser: { id: 2, role: Role.User },
  step: WeddingSteps.Dress,
  offset: 0,
  countryCode: CountryCode.JO,
});
