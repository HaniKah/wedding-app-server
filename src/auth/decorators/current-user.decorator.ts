import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface FirebaseUser {
  uid: string;
  email?: string;
  phoneNumber?: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
  customClaims?: any;
}

/**
 * Decorator to extract the current authenticated user from the request
 * Usage: @CurrentUser() user: FirebaseUser
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): FirebaseUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
