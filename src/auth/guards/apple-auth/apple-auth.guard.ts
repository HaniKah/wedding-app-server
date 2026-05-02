import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import AppleOauthConfig from '../../config/appleOauth.config';
import type { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { AuthService } from '../../auth.service';
import {
  AppleAuthorizeResponse,
  AppleTokenResponse,
} from '../../../types/auth/apple.dto';
import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';

@Injectable()
export class AppleAuthGuard implements CanActivate {
  constructor(
    @Inject(AppleOauthConfig.KEY)
    private readonly appleOauthConfig: ConfigType<typeof AppleOauthConfig>,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Request<Params, ResBody, ReqBody, Query>;
    const req = context
      .switchToHttp()
      .getRequest<Request<any, any, AppleAuthorizeResponse>>();

    if (!req.body?.code) {
      throw new Error('Missing code');
    }

    const { id_token } = await this.exchangeToken(req.body.code);

    if (!id_token) throw new Error('Failed to exchange token with Apple');

    const payload = await this.verifyIdentityToken(id_token);

    const userRecord = await this.authService.validateAppleUser(
      req.body.user,
      payload,
    );
    req.user = {
      id: userRecord.id,
      role: userRecord.role,
    };

    return true;
  }

  private async exchangeToken(code: string): Promise<AppleTokenResponse> {
    const params = new URLSearchParams({
      client_id: this.appleOauthConfig.clientID,
      client_secret: this.appleOauthConfig.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.appleOauthConfig.callbackURL,
    });

    const { data }: { data: AppleTokenResponse } = await firstValueFrom(
      this.httpService.post(
        'https://appleid.apple.com/auth/token',
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    return data;
  }

  private async verifyIdentityToken(idToken: string): Promise<JWTPayload> {
    const jwks = createRemoteJWKSet(
      new URL('https://appleid.apple.com/auth/keys'),
    );

    try {
      const { payload } = await jwtVerify(idToken, jwks, {
        issuer: 'https://appleid.apple.com',
        audience: this.appleOauthConfig.clientID, // your Services ID or App ID
      });

      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid Apple identity token:', err);
    }
  }
}
