import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
    secret: process.env.NEXT_AUTH_SECRET,
    providers: [
        Providers.Google({
            clientId: process.env.NEXT_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_AUTH_GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        session(session, token) {
            session.user.id = token.id;
            return session;
        }
    },
    adapter: Adapters.Prisma.Adapter({prisma})
})