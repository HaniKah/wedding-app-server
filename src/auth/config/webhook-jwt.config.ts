import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'webhook-jwt',
  (): JwtModuleOptions => ({
    secret: process.env.WEBHOOK_JWT_SECRET,
  }),
);
