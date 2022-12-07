import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Role } from '@prisma/client';

import { prisma } from '../../../modules/db';
import { isNullOrWhiteSpace } from '../../../modules/util';

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
            image: createAvatarImage(profile.name),
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

function createAvatarImage(userName?: string) {
  if (isNullOrWhiteSpace(userName)) {
    return undefined;
  }

  let twoLetter = '';
  const strArr = userName.split(' ');
  if (strArr.length === 1) {
    twoLetter = strArr[0].substring(0, 2);
  } else {
    twoLetter = strArr[0].substring(0, 1) + strArr[1].substring(0, 1);
  }

  const svg = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle fill="#dbf0f3" cx="50" cy="50" r="50"></circle>
<text x="50%" y="50%" font-family="Verdana" font-size="42" fill="#6d9291" text-anchor="middle" dominant-baseline="central">${twoLetter}</text>
</svg>
`;

  const base64Svg = Buffer.from(svg).toString('base64');
  const imageSrc = `data:image/svg+xml;base64, ${base64Svg}`;

  return imageSrc;
}

export default NextAuth(authOptions);
