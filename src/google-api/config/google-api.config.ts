import { registerAs } from '@nestjs/config';

export default registerAs('googleApi', () => ({
  apiKey: process.env.GOOGLE_PLACES_API_KEY,
}));
