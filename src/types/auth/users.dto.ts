export class UsersDto {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}
export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}
