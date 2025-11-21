export type UserRole = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}
