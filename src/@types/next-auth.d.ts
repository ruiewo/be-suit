import { DefaultSession } from 'next-auth';

import { Role } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role;
      image: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
  }
}
