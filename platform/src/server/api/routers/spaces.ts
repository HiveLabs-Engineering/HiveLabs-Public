import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getGroupInfo } from "~/lib/group.services";
import { randomUUID } from "crypto";

import axios from "axios";

import Stripe from "stripe";
import { getUser } from "~/services";
import { cookies, headers } from "next/headers";
const stripe = new Stripe("");

export const spacesRouter = createTRPCRouter({
  fetch: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.groups
        .findFirst({
          where: {
            id: `${input.id}`,
          },
        })
        .catch((err) => {
          throw new Error("Error");
        });
    }),

  edit: publicProcedure
    .input(z.object({ type: z.string(), value: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const value = await input.value;

      return { type: `${input.type}`, value: `${value}` };
    }),
});
