import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => ({
  secretKey: process.env.MINIO_SECRET_KEY,
  accessKey: process.env.MINIO_ACCESS_KEY,
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true', //has to be true on production
}));
