import NextAuth, {type NextAuthOptions, Session} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import {UserType} from "@/types/UserType";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: { strategy: "database" },
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                (session.user as UserType).id = user?.id ?? token?.sub ?? null;
            }
            return session;
        },
    },
    events: {
        async createUser(user) { console.log("NEXTAUTH createUser:", user); },
        async linkAccount(account) { console.log("NEXTAUTH linkAccount:", account); },
        async signIn(message) { console.log("NEXTAUTH signIn:", message); },
    },
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};