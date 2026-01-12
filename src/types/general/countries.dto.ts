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
  BH = 'BH',
  EG = 'EG',
  IR = 'IR',
  IQ = 'IQ',
  JO = 'JO',
  KW = 'KW',
  LB = 'LB',
  OM = 'OM',
  PS = 'PS',
  QA = 'QA',
  SA = 'SA',
  SY = 'SY',
  TR = 'TR',
  AE = 'AE',
  YE = 'YE',
  SD = 'SD',
}

export class CountryInfo {
  countryName: string;
  states: string[];
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  countryCode: CountryCode;
  currency: string;
}

export class CountryInfoViewModel {
  result: CountryInfo[];
}
