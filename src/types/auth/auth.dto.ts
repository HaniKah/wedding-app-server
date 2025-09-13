export class SignUpDto {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}
export class SignInDto {
  email: string;
  password: string;
}
export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}
