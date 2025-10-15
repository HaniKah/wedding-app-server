import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expiresIn: process.env.REFRESH_JWT_EXPIRE_IN as any,
  }),
);
