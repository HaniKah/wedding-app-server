import { registerAs } from '@nestjs/config';

export default registerAs('videos', () => ({
  minioBaseUrl: process.env.MINIO_BASE_URL,
}));
