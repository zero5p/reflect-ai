import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub as string;
      }
      return session;
    },
  },
};
