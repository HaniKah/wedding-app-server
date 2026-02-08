export class ExchangeTokenDto {
  id: number;
  rcAppUserId: string;
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}
export class UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}
