import { registerAs } from '@nestjs/config';

export default registerAs('appVersion', () => ({
  minSupportedVersion: process.env.MIN_SUPPORTED_VERSION || '1.0.0',
  latestVersion: process.env.LATEST_VERSION || '1.0.0',
  storeUrls: {
    ios: process.env.IOS_STORE_URL || 'https://apps.apple.com',
    android: process.env.ANDROID_STORE_URL || 'https://play.google.com',
  },
}));
