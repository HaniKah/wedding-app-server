import { PlacesViewModel } from '../../../types/planner/places.dto';
import { Role } from '../../../types/auth/auth.dto';
import { CountryCode } from '../../../types/general/countries.dto';
import { PriceType } from '../../../types/places/places.dto';
import { Categories } from '../../../types/general/categories';

export const placesViewModelStub = (): PlacesViewModel => {
  return {
    places: [
      {
        id: 123,
        name: 'sample Cars',
        category: Categories.Dress,
        isPromoted: false,
        label: null,
        mainPhoto: 'https://placehold.co/600x400',
        maxPrice: '250',
        minPrice: '50',
        phoneNumber: '0795542743',
        priceType: PriceType.None,
        formattedAddress:
          'sample address , sample city , sample state , sample country',
      },
    ],
  };
};

export const getPlaceRequestStub = () => ({
  loggedInUser: { id: 2, role: Role.User },
  step: Categories.Dress,
  offset: 0,
  countryCode: CountryCode.JO,
});
