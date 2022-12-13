import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Role } from '@prisma/client';

import { prisma } from '../../../modules/db';

const defaultOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: '/signIn',
    signOut: '/signIn',
    // signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: { params: { scope: 'email openid profile User.Read' } },
      async profile(profile, tokens) {
        const profilePhotoSize = 48;
        // https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
        const profilePicture = await fetch(`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        let image: string | null = null;

        // Confirm that profile photo was returned
        if (profilePicture.ok) {
          const pictureBuffer = await profilePicture.arrayBuffer();
          const pictureBase64 = Buffer.from(pictureBuffer).toString('base64');
          image = `data:image/jpeg;base64, ${pictureBase64}`;
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: image,
          role: 'user',
        };
      },
    }),
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],

  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }: { session: Session; user: User | AdapterUser; token: JWT }) {},
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.image = user.image ?? '';
      return session;
    },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
  },
};

const debugOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'admin-login',
      name: 'admin-login',
      credentials: {
        // username: { label: 'Username', type: 'text', placeholder: 'admin' },
        // password: { label: 'Password', type: 'password', placeholder: 'admin' },
      },
      async authorize(credentials: any, req: any) {
        return {
          id: 'admin',
          name: 'admin',
          email: 'admin@email.com',
          role: 'admin',
        };
      },
    }),

    CredentialsProvider({
      id: 'user-login',
      name: 'user-login',
      credentials: {
        // username: { label: 'Username', type: 'text', placeholder: 'user' },
        // password: { label: 'Password', type: 'password', placeholder: 'user' },
      },
      async authorize(credentials: any, req: any) {
        return {
          id: 'user',
          name: 'user',
          email: 'user@email.com',
          role: 'user',
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      session.user.role = session.user.name as Role;
      return session;
    },
  },
};

export const authOptions = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ? debugOption : defaultOptions;

export default NextAuth(authOptions);
