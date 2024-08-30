import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getGroupInfo } from "~/lib/group.services";
import { randomUUID } from "crypto";
import { getUser } from "~/services";
import { cookies } from "next/headers";

export const memberCounter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return true;
    }),
});
