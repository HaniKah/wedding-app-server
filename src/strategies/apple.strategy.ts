import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import appleOauthConfig from '../auth/config/appleOauth.config';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { Strategy } from 'passport-apple';
import { AuthenticateOptions } from 'passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    @Inject(appleOauthConfig.KEY)
    private appleConfiguration: ConfigType<typeof appleOauthConfig>,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: appleConfiguration.clientID,
      callbackURL: appleConfiguration.callbackURL,
      passReqToCallback: true,
      teamID: appleConfiguration.teamID,
      keyID: appleConfiguration.keyID,
      privateKeyString: appleConfiguration.privateKeyString,
      scope: ['email', 'name'],
    });
  }
  authenticate(req: Request, options: AuthenticateOptions) {
    options.state = req.query.state as string;
    // options.prompt = 'select_account';
    super.authenticate(req, options);
  }
  validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    decodedIdToken: any, // passport-apple v1+ pre-decodes this for you!
    done: Function,
  ) {
    // decodedIdToken is ALREADY the decoded JWT payload ({ sub, email, ... })
    const sub = decodedIdToken?.sub;
    console.log('decodedIdToken', decodedIdToken);
    // ...
  }
}
