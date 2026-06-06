import { users } from "~/server/db/schema";
import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.select().from(users);
    return data;
  }),
});
