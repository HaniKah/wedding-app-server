import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
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

@Injectable()
export class AppleAuthGuard implements CanActivate {
  constructor(
    @Inject(AppleOauthConfig.KEY)
    private readonly appleOauthConfig: ConfigType<typeof AppleOauthConfig>,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const body: AppleAuthorizeResponse = req.body;
    if (!body?.code) {
      throw new Error('Missing code');
    }
    const params = new URLSearchParams({
      client_id: this.appleOauthConfig.clientID,
      client_secret: this.appleOauthConfig.clientSecret,
      code: body?.code,
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

    if (!data.id_token) throw new Error('Failed to exchange token');

    const userRecord = await this.authService.validateAppleUser(
      body.user,
      data.id_token,
    );
    req.user = {
      id: userRecord.id,
      role: userRecord.role,
    };

    return true;
  }
}
