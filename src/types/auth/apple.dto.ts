export class ApplePayloadDto {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce_supported: boolean;
  email: string;
  email_verified: string;
  is_private_email: boolean;
  real_user_status: number;
  transfer_sub: string;
  org_id: string;
  scopes: any; //check this may not be any
}
