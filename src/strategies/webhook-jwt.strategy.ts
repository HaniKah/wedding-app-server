import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import WebhookJwtConfig from '../auth/config/webhook-jwt.config';

@Injectable()
export class WebhookJwtStrategy extends PassportStrategy(
  Strategy,
  'webhook-jwt',
) {
  constructor(
    @Inject(WebhookJwtConfig.KEY)
    private webhookJwtConfiguration: ConfigType<typeof WebhookJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: webhookJwtConfiguration.secret as string,
      ignoreExpiration: true,
    });
  }
  validate() {
    return true;
  }
}
