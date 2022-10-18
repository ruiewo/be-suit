import NextAuth, { Session, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../modules/db';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    async session({ session, token, user }: { session: Session; user: User | AdapterUser; token: JWT }) {
      // @ts-ignore
      session.user.role = user.role;
      return session;
    },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
  },
};

export default NextAuth(authOptions);
