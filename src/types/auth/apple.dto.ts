//this is the first step of requesting a code
export interface AppleAuthorizeRequestParams {
  client_id: string;
  nonce?: string;
  redirect_uri: string;
  response_mode?: string;
  response_type: string;
  scope?: string;
  state?: string;
}

export class AppleAuthorizeResponse {
  state: string;
  code: string;
  user: string; //this is json and the type is underneath
}
//this is the user type after parsing from above
export class AppleUserAuthorizeResponse {
  name: { firstName: string; lastName: string };
  email: string;
}

//once we have the code we exchange it with these data to get the token response
export class AppleTokenRequest {
  client_id: string;
  client_secret: string;
  code?: string;
  grant_type: string;
  refresh_token?: string;
  redirect_uri?: string;
}

// we receive this after exchanging the code for a token
export class AppleTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

//that what you see inside the id_token
export class AppleIdTokenPayload {
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
// this is what you see inside the JWKSet when fetching /auth/keys
export class AppleJWKSetKeys {
  alg: string; // The encryption algorithm used to encrypt the token.
  e: string; //   The exponent value for the RSA public key.
  kid: string; //  A 10-character identifier key, obtained from your developer account.
  kty: string; //   The key type parameter setting. You must set to “RSA”.
  n: string; //  The modulus value for the RSA public key.
  use: string; //  The intended use for the public key.
}
export class AppleJWKPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  at_hash: string;
  email: string;
  email_verified: boolean;
  is_private_email: boolean;
  auth_time: number;
  nonce_supported: boolean;
}
