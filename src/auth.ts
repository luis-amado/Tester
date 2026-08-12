import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { validateUserFromDb } from "./server/utils/authUtils";
import z from "zod";

const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Validate the passed credentials
        let parsedCredentials = null;
        try {
          parsedCredentials = await signInSchema.parseAsync(credentials);
        } catch {
          return null;
        }

        // Check user exists
        const foundUser = await validateUserFromDb(
          parsedCredentials.username,
          parsedCredentials.password,
        );

        return foundUser;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
});
