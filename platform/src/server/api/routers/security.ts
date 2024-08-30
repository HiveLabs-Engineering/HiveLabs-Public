import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getGroupInfo } from "~/lib/group.services";
import { randomUUID } from "crypto";
import { getUser } from "~/services";
import { cookies } from "next/headers";
import { ipAddress } from "@vercel/edge";
import { Castle } from "@castleio/sdk";

const castle = new Castle({ apiSecret: "" });

interface CastleRiskResponse {
  policy: {
    action: string;
  };
}

export const security = createTRPCRouter({
  risk: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const ip = ipAddress(ctx);

        const headers: Record<string, string> = {};
        ctx.headers.forEach((value: string, key: string) => {
          headers[key] = value;
        });

        const isAuthed = await getUser(
          `${cookies().get("hive_colony")?.value}`,
        );
        const user = await ctx.db.user.findFirstOrThrow({
          where: {
            userId: `${isAuthed.userId}`,
          },
        });

        if (user.email) {
          const res = (await castle.risk({
            type: "$custom",
            name: "Risk Assessment",
            request_token: input.token,
            user: {
              id: user.userId,
              name: user.username,
              email: user.email,
            },
            context: {
              ip: `${ip}`,
              headers,
            },
          })) as CastleRiskResponse;

          return { status: res.policy.action };
        } else {
          return { status: "allow" };
        }
      } catch (err) {
        console.error("Error:", err);
        return { status: "allow", error: `${err}` };
      }
    }),
});
