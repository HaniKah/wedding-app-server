import { registerAs } from '@nestjs/config';

export default registerAs('photos', () => ({
  minioBaseUrl: process.env.MINIO_BASE_URL,
}));
