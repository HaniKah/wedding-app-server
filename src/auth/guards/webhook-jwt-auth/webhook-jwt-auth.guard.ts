import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookJwtAuthGuard extends AuthGuard('webhook-jwt') {}
