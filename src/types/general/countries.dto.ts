// export enum Country {
//   Bahrain = 'Bahrain',
//   Egypt = 'Egypt',
//   Iran = 'Iran',
//   Iraq = 'Iraq',
//   Jordan = 'Jordan',
//   Kuwait = 'Kuwait',
//   Lebanon = 'Lebanon',
//   Oman = 'Oman',
//   Palestine = 'Palestine',
//   Qatar = 'Qatar',
//   SaudiArabia = 'SaudiArabia',
//   Syria = 'Syria',
//   Turkey = 'Turkey',
//   UnitedArabEmirates = 'UnitedArabEmirates',
//   Yemen = 'Yemen',
//   Sudan = 'Sudan',
// }
import { ApiProperty } from '@nestjs/swagger';

export enum CountryCode {
  // Gulf
  AE = 'AE',
  BH = 'BH',
  KW = 'KW',
  OM = 'OM',
  QA = 'QA',
  SA = 'SA',
  // Levant
  IQ = 'IQ',
  JO = 'JO',
  LB = 'LB',
  PS = 'PS',
  SY = 'SY',
  // North Africa
  DZ = 'DZ',
  EG = 'EG',
  LY = 'LY',
  MA = 'MA',
  MR = 'MR',
  TN = 'TN',
  // Horn of Africa / East Africa (Arab League members)
  DJ = 'DJ',
  KM = 'KM',
  SO = 'SO',
  SD = 'SD',
  // Other Middle East
  IR = 'IR',
  TR = 'TR',
  YE = 'YE',
}

export class CountryInfo {
  countryName: string;
  cities: string[];
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  countryCode: CountryCode;
  currency: string;
}

export class CountryInfoViewModel {
  result: CountryInfo[];
}
