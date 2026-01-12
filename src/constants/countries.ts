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
      currency: 'BHD',
    },
  ],
  [
    CountryCode.EG,
    {
      countryCode: CountryCode.EG,
      countryName: 'Egypt',
      states: [],
      currency: 'EGP',
    },
  ],
  [
    CountryCode.IR,
    {
      countryCode: CountryCode.IR,
      countryName: 'Iran',
      states: [],
      currency: 'IRR',
    },
  ],
  [
    CountryCode.IQ,
    {
      countryCode: CountryCode.IQ,
      countryName: 'Iraq',
      states: [],
      currency: 'IQD',
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
      currency: 'JOD',
    },
  ],
  [
    CountryCode.KW,
    {
      countryCode: CountryCode.KW,
      countryName: 'Kuwait',
      states: [],
      currency: 'KWD',
    },
  ],
  [
    CountryCode.LB,
    {
      countryCode: CountryCode.LB,
      countryName: 'Lebanon',
      states: [],
      currency: 'LBP',
    },
  ],
  [
    CountryCode.OM,
    {
      countryCode: CountryCode.OM,
      countryName: 'Oman',
      states: [],
      currency: 'OMR',
    },
  ],
  [
    CountryCode.PS,
    {
      countryCode: CountryCode.PS,
      countryName: 'Palestine',
      states: [],
      currency: 'ILS',
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
      currency: 'QAR',
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
      currency: 'SAR',
    },
  ],
  [
    CountryCode.SY,
    {
      countryCode: CountryCode.SY,
      countryName: 'Syria',
      states: [],
      currency: 'SYP',
    },
  ],
  [
    CountryCode.TR,
    {
      countryCode: CountryCode.TR,
      countryName: 'Turkey',
      states: [],
      currency: 'TRY',
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
      currency: 'AED',
    },
  ],
  [
    CountryCode.YE,
    {
      countryCode: CountryCode.YE,
      countryName: 'Yemen',
      states: [],
      currency: 'YER',
    },
  ],
  [
    CountryCode.SD,
    {
      countryCode: CountryCode.SD,
      countryName: 'Sudan',
      states: [],
      currency: 'SDG',
    },
  ],
]);
