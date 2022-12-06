import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CognitoProvider from 'next-auth/providers/cognito';
import GithubProvider from 'next-auth/providers/github';

import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { prisma } from '../../../modules/db';

export const authOptions: NextAuthOptions = {
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

        // Confirm that profile photo was returned
        if (profilePicture.ok) {
          const pictureBuffer = await profilePicture.arrayBuffer();
          const pictureBase64 = Buffer.from(pictureBuffer).toString('base64');

          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: `data:image/jpeg;base64, ${pictureBase64}`,
            role: 'user',
          };
        } else {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            role: 'user',
          };
        }
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
      session.user.role = user.role;
      session.user.image = user.image ?? '';
      return session;
    },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
  },
};

export default NextAuth(authOptions);
