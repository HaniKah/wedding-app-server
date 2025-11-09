import { createParamDecorator } from '@nestjs/common';
import { CurrentUser } from '../types/auth/auth.dto';
import { Request } from 'express';

export const User = createParamDecorator((data: unknown, ctx) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const user: CurrentUser = request.user;
  return user;
});
