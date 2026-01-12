import { CountryCode, CountryInfo } from '../types/general/countries.dto';

export const COUNTRIES: Map<CountryCode, CountryInfo> = new Map<
  CountryCode,
  CountryInfo
>([
  [
    CountryCode.BH,
    {
      countryCode: CountryCode.BH,
      countryName: 'Bahrain',
      states: [],
    },
  ],
  [
    CountryCode.EG,
    {
      countryCode: CountryCode.EG,
      countryName: 'Egypt',
      states: [],
    },
  ],
  [
    CountryCode.IR,
    {
      countryCode: CountryCode.IR,
      countryName: 'Iran',
      states: [],
    },
  ],
  [
    CountryCode.IQ,
    {
      countryCode: CountryCode.IQ,
      countryName: 'Iraq',
      states: [],
    },
  ],
  [
    CountryCode.JO,
    {
      countryCode: CountryCode.JO,
      countryName: 'Jordan',
      states: [
        'amman',
        'irbid',
        'zarqa',
        'mafraq',
        'ajloun',
        'jerash',
        'madaba',
        'balqa',
        'karak',
        'tafilah',
        "ma'an",
        'aqaba',
      ],
    },
  ],
  [
    CountryCode.KW,
    {
      countryCode: CountryCode.KW,
      countryName: 'Kuwait',
      states: [],
    },
  ],
  [
    CountryCode.LB,
    {
      countryCode: CountryCode.LB,
      countryName: 'Lebanon',
      states: [],
    },
  ],
  [
    CountryCode.OM,
    {
      countryCode: CountryCode.OM,
      countryName: 'Oman',
      states: [],
    },
  ],
  [
    CountryCode.PS,
    {
      countryCode: CountryCode.PS,
      countryName: 'Palestine',
      states: [],
    },
  ],
  [
    CountryCode.QA,
    {
      countryCode: CountryCode.QA,
      countryName: 'Qatar',
      states: [
        'doha',
        'al rayyan',
        'al wakra',
        'al khor',
        'umm salal',
        'al daayen',
        'al shamal',
        'al shahaniya',
      ],
    },
  ],
  [
    CountryCode.SA,
    {
      countryCode: CountryCode.SA,
      countryName: 'Saudi Arabia',
      states: [
        'riyadh',
        'makkah',
        'madinah',
        'eastern province',
        'asir',
        'tabuk',
        'hail',
        'northern borders',
        'jizan',
        'najran',
        'al bahah',
        'al jawf',
        'qassim',
      ],
    },
  ],
  [
    CountryCode.SY,
    {
      countryCode: CountryCode.SY,
      countryName: 'Syria',
      states: [],
    },
  ],
  [
    CountryCode.TR,
    {
      countryCode: CountryCode.TR,
      countryName: 'Turkey',
      states: [],
    },
  ],
  [
    CountryCode.AE,
    {
      countryCode: CountryCode.AE,
      countryName: 'United Arabs of Emirates',
      states: [
        'abu dhabi',
        'dubai',
        'sharjah',
        'ajman',
        'umm al quwain',
        'ras al khaimah',
        'fujairah',
      ],
    },
  ],
  [
    CountryCode.YE,
    {
      countryCode: CountryCode.YE,
      countryName: 'Yemen',
      states: [],
    },
  ],
  [
    CountryCode.SD,
    {
      countryCode: CountryCode.SD,
      countryName: 'Sudan',
      states: [],
    },
  ],
]);
