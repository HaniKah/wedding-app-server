import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('google/login')
  googleLogin(@Req() req: Request, @Res() res: Response) {
    const redirectUri = req.query.redirect_uri as string;
    const clientId = req.query.client_id as string;
    const scope = req.query.scope as string;
    const state = req.query.state as string;
    let platform;

    if (redirectUri === this.configService.get('APP_SCHEME')) {
      platform = 'mobile';
    } else if (redirectUri === this.configService.get('APP_URL')) {
      platform = 'web';
    } else {
      throw new Error('Invalid redirect URI');
    }

    const stateWithPlatform = platform + '|' + state;

    // this is not necessary , but if we want to combine handling apple and google on the same controller , here we have to differentiate the client_id
    let idpClientId: string;
    if (clientId === 'google') {
      idpClientId = this.configService.get('GOOGLE_CLIENT_ID') as string;
    } else {
      throw new Error('Invalid client id');
    }
    const sendParams = new URLSearchParams({
      client_id: idpClientId,
      redirect_uri: this.configService.get<string>(
        'GOOGLE_CALLBACK_URL',
      ) as string,
      response_type: 'code',
      scope: scope || 'identity',
      state: stateWithPlatform,
      prompt: 'select_account',
    });

    return res.redirect(
      this.configService.get<string>('GOOGLE_AUTH_URL') +
        '?' +
        sendParams.toString(),
    );
  }

  //here we get the code from google so we can exchange it for a token
  @Public()
  @Get('callback')
  googleCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.params.state) {
      return Response.json({ error: 'Invalid state' }, { status: 400 });
    }
    const platform = req.params.state.split('|')[0];
    const state = req.params.state.split('|')[1];

    const outgoingParams = new URLSearchParams({
      code: req.params.code || '',
      state,
    });
    // so here we are going back to the app with the code and the state , we could argue that returning code is unnecessary
    return res.redirect(
      (this.configService.get<string>(
        platform === 'mobile' ? 'APP_SCHEME' : 'APP_URL',
      ) as string) +
        '?' +
        outgoingParams.toString(),
    );
  }
}
