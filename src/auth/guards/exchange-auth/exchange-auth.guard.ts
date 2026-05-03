import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { ConfigType } from '@nestjs/config';
import exchangeJwtConfig from '../../config/exchange-jwt.config';
import { AuthJwtPayload } from '../../../types/auth/auth.dto';

@Injectable()
export class ExchangeAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(exchangeJwtConfig.KEY)
    private readonly exchangeTokenConfig: ConfigType<typeof exchangeJwtConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader: string = request.get('Authorization');
    const token = authHeader?.split(' ')[1]; // e.g., "Bearer <token>"

    if (!token) {
      throw new UnauthorizedException('Missing exchange token');
    }
    console.log('token:', token.substring(0, 5));
    console.log(
      'secret:',
      this.exchangeTokenConfig.secret.toString().substring(0, 5),
    );

    try {
      const payload: AuthJwtPayload = this.jwtService.verify(token, {
        secret: this.exchangeTokenConfig.secret,
      });

      //todo role to be adjusted
      request.user = { id: payload.sub, role: payload.role };
      return true;
    } catch (err) {
      console.error(err);
    }
  }
}
