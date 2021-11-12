import NextAuth from 'next-auth';

declare module "next-auth" {
    interface Session {
        user: {
            id: int;
            name: string;
            email: string;
            image: string;
        }
    }
}