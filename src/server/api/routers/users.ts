import { users } from "~/server/db/schema";
import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";
import z from "zod";
import { eq } from "drizzle-orm";
import { hashPassword } from "~/server/utils/authUtils";

export const usersRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        username: z.string().min(1),
        password: z.string().min(1).min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if username is taken
      try {
        const usernameResult = await ctx.db
          .select()
          .from(users)
          .where(eq(users.username, input.username));
        if (usernameResult.length > 0) {
          return {
            err_code: "ERR_SIGNUP_USERNAME_TAKEN" as const,
          };
        }

        // Hash the password
        const hashedPassword = await hashPassword(input.password);
        if (!hashedPassword) {
          return {
            err_code: "ERR_USER_NOT_CREATED" as const,
          };
        }

        // Create the user
        const [createdUser] = await ctx.db
          .insert(users)
          .values({
            name: input.name,
            username: input.username,
            password: hashedPassword,
          })
          .returning();
        if (!createdUser) {
          return {
            err_code: "ERR_USER_NOT_CREATED" as const,
          };
        }

        return {
          user: {
            id: createdUser.id,
            name: createdUser.name,
            username: createdUser.username,
          },
        };
      } catch {
        return {
          err_code: "ERR_UNEXPECTED" as const,
        };
      }
    }),
});
