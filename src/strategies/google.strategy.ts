import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import googleOauthConfig from '../auth/config/googleOauth.config';
import { Role } from '../types/auth/auth.dto';
import { AuthenticateOptions } from 'passport';
import { Request } from 'express';
import { GoogleProfileDto } from '../types/auth/google.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  //this here to interrupt the normal flow of passport google and manually use the authenticate function because we had to add state manually which was not working in the constructor here is the fix : https://stackoverflow.com/questions/60857548/how-to-pass-state-during-nest-js-authentication-flow
  authenticate(req: Request, options: AuthenticateOptions) {
    options.state = req.query.state as string;
    options.prompt = 'select_account';
    super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfileDto,
  ) {
    return await this.authService.validateGoogleUser({
      google_id: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      role: Role.User,
    });
  }
}
