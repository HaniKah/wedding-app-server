import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'exchange-jwt',
  (): JwtSignOptions => ({
    secret: process.env.EXCHANGE_JWT_SECRET,
    expiresIn: Number(process.env.EXCHANGE_JWT_EXPIRES_IN),
  }),
);
