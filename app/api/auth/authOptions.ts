import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 현재는 개발용 더미 인증
        // 나중에 실제 데이터베이스 인증으로 교체 필요
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Test User",
            email: "test@example.com",
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
}