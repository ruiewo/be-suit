import { Role } from '@prisma/client';

export type UserModel = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
};
