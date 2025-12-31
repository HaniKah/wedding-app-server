export class ExchangeTokenDto {
  id: number;
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}
export class UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}
