import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  debug: true,
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔍 JWT callback:", { token, user })
      return token
    },
    async session({ session, token }) {
      console.log("🔍 Session callback:", { session, token })
      return session
    },
  },
}