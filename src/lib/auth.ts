import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Adjust fields/providers to your actual schema and flows
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // Implement your auth logic (e.g., check user in DB, verify password hash)
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        // You should verify the password here
        return { id: String(user.id), email: user.email, name: user.name ?? undefined };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (token?.uid) (session as any).uid = token.uid;
      return session;
    }
  },
  pages: {
    signIn: "/auth/login"
  }
};
