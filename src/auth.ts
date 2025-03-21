import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateUser } from "./db/auth";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email").trim(),
  password: z.string({ required_error: "Password is required" }).trim(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          const validatedFields = await LoginSchema.safeParseAsync(credentials);
          if (validatedFields.success) {
            const user = await authenticateUser(
              validatedFields.data.email,
              validatedFields.data.password
            );
            if (user) {
              return { id: user._id.toString(), name: user.name, email: user.email };
            }
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      return { ...token, ...user };
    },
    session: async ({ session, token }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
});
