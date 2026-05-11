import { ApiProperty } from '@nestjs/swagger';
import { PriceType } from '../places/places.dto';
import { CountryCode } from '../general/countries.dto';
import { Categories } from '../general/categories';

export class FavoritePlaceDto {
  id: number;
  isFound: boolean;
  name?: string;
  thumbnail?: string;
  minPrice?: string;
  maxPrice?: string;
  @ApiProperty({ enum: PriceType, enumName: 'PriceType' })
  priceType?: PriceType;
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  country?: CountryCode;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category?: Categories;
}
