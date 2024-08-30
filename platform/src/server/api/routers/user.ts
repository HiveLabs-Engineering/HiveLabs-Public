import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getGroupInfo } from "~/lib/group.services";
import { randomUUID } from "crypto";
import { getUser } from "~/services";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
  whois: publicProcedure.query(async ({ ctx }) => {
    const isAuthed = await getUser(`${cookies().get("hive_colony")?.value}`);

    return ctx.db.user.findFirstOrThrow({
      where: {
        userId: `${isAuthed.userId}`,
      },
    });
  }),
  fetch: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user
        .findFirst({
          where: {
            userId: `${input.id}`,
          },
        })
        .catch((err) => {
          throw new Error("Error");
        });
    }),
});
