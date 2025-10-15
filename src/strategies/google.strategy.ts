import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import googleOauthConfig from '../auth/config/googleOauthConfig';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { Role } from '../types/auth/auth.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID as string,
      clientSecret: googleConfiguration.clientSecret as string,
      callbackURL: googleConfiguration.callbackURL as string,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateGoogleUser({
      role: Role.User,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      email: profile.email[0],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      firstName: profile.name.givenName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      lastName: profile.name.familyName,
      password: '',
    });
    return user;
  }
}
