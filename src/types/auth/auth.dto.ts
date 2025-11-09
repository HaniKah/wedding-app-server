// export class SignUpDto {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   role: Role;
// }
// export class SignInDto {
//   email: string;
//   password: string;
// }
export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}
export type AuthJwtPayload = {
  sub: number;
  role: Role;
};
export class CurrentUser {
  id: number;
  role: Role;
}

export enum Provider {
  Google = 'Google',
  Apple = 'Apple',
  Facebook = 'Facebook',
}
