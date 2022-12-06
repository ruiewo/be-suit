import { Role } from '@prisma/client';

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
};
