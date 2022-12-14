import { env } from '@env/server.mjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@server/db/client';
import { ROUTE } from '@utils/constants';
import type { User } from 'next-auth';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

type ExtendedUser = User & { isAdmin: boolean };

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = (user as ExtendedUser).isAdmin;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google')
        return (
          profile?.email?.endsWith('mundimoto.com') ||
          profile?.email?.endsWith('compramostumoto.es') ||
          profile?.email === 'crojasdomenech@gmail.com'
        );

      return false;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: { timeout: 50000 },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: ROUTE.CALENDAR,
    signOut: ROUTE.CALENDAR,
    error: ROUTE.AUTH_ERROR,
  },
};

export default NextAuth(authOptions);
