import { registerAs } from '@nestjs/config';

export default registerAs('appleOAuth', () => ({
  clientID: process.env.APPLE_CLIENT_ID,
  keyID: process.env.APPLE_KEY_ID,
  teamID: process.env.APPLE_TEAM_ID,
  clientSecret: process.env.APPLE_SECRET,
  callbackURL: process.env.APPLE_CALLBACK_URL,
  appScheme: process.env.APP_SCHEME,
  appleAuthUrl: process.env.APPLE_AUTH_URL,
}));
