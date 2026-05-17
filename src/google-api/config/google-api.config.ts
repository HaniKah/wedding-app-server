import { registerAs } from '@nestjs/config';

export default registerAs('googleApi', () => ({
  apiKey: process.env.GOOGLE_PLACES_API_KEY,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  visionPrivateKey: process.env.GOOGLE_VISION_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n',
  ),
  visionClientEmail: process.env.GOOGLE_VISION_CLIENT_EMAIL,
  visionApiKey: process.env.GOOGLE_VISION_API_KEY,
  baseUrl: process.env.BASE_URL,
}));
