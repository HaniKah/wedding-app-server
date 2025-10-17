import { Role } from '../auth/auth.dto';

declare global {
  namespace Express {
    interface User {
      id: number;
      role: Role;
    }
  }
}
