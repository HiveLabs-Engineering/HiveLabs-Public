import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getGroupInfo } from "~/lib/group.services";
import { randomUUID } from "crypto";

import Stripe from "stripe";
import { getUser } from "~/services";
import { cookies } from "next/headers";
const stripe = new Stripe("");

export const billingRouter = createTRPCRouter({
  checkout: publicProcedure
    .input(
      z.object({
        success: z.string(),
        cancel: z.string(),
        product: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.create({
        customer: "",
        success_url: `${input.success}`,
        cancel_url: `${input.cancel}`,
        line_items: [
          {
            price: `${input.product}`,
            quantity: 1,
          },
        ],
        metadata: { workspace: "HiveLabs" },
        mode: "subscription",
      });

      const sessionId = session.id;

      return session.url;
    }),
});
