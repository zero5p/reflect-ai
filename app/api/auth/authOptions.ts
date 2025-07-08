import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      console.log("🔍 NextAuth session callback:", { session, token })
      if (token?.id && session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    },
    async jwt({ token, user, account }) {
      console.log("🔍 NextAuth JWT callback:", { token, user, account })
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
}