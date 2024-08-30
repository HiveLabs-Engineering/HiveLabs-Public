import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getGroupInfo } from "~/lib/group.services";
import { getUser } from "~/services";
import { cookies } from "next/headers";
import { createStripeCustomer } from "~/util/billing.service";
import Stripe from "stripe";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import fetch from "node-fetch";
import { connectCustomer, getIntercomCustomer } from "~/services/intercom";

const stripe = new Stripe("");

export const colonyRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const groupInfo = await getGroupInfo(input.id);
        const authCookie = cookies().get("hive_colony")?.value;

        if (!authCookie) {
          return {
            success: false,
            message: "Authorization has been denied for this request.",
          };
        }

        const auth = await getUser(authCookie);

        if (!auth) {
          return {
            success: false,
            message: "Authorization has been denied for this request.",
          };
        }

        const user = await ctx.db.user.findFirst({
          where: {
            userId: `${auth.userId}`,
          },
        });

        if (!user) {
          return {
            success: false,
            message: "User not found.",
          };
        }

        const customer = await createStripeCustomer(
          `${groupInfo?.name}`,
          `${user?.email}`,
        );
        const groupId = groupInfo?.id;

        const existingColony = await ctx.db.groups.findUnique({
          where: { groupId: `${groupId}` },
        });

        let colony;
        if (!existingColony) {
          colony = await ctx.db.groups.create({
            data: {
              name: `${groupInfo?.name}`,
              groupId: `${groupId}`,
              ownership: {
                username: `${user.username}`,
                userId: `${user.userId}`,
              },
              customisation: {
                color: `#6466e9`,
                wallpaper: `https://ucarecdn.com/b552ae43-e4f7-405e-a4f1-02f0adde1ec9/`,
              },
              tracking: [],
              payment_required: true,
              stripe_id: `${customer.id}`,
            },
          });

          const company = await fetch(``, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Intercom-Version": "2.11",
              Authorization: "",
            },
            body: JSON.stringify({
              company_id: `${colony.id}`,
              name: `${groupInfo?.name}`,
              website: `https://roblox.com/groups/${groupId}`,
              remote_created_at: Math.floor(Date.now() / 1000),
            }),
          });

          const companyData = (await company.json()) as any;
          const intercomCustomer = (await getIntercomCustomer(
            `${user.userId}`,
          )) as any;
          const connect = connectCustomer(
            `${intercomCustomer.data[0].id}`,
            `${companyData?.id}`,
          );

          console.log("New group created:", colony);
        } else {
          console.log(
            "Group with this groupId already exists:",
            existingColony,
          );
          colony = existingColony;
        }

        const session = await stripe.checkout.sessions.create({
          customer: `${customer.id}`,
          success_url: `https://platform.hivelabs.app/${colony.id}?onboard=true`,
          cancel_url: `https://platform.hivelabs.app/ready`,
          line_items: [
            {
              price: `price_1P0rrkIf262eZ1FbXMSnLJjj`,
              quantity: 1,
            },
          ],
          mode: "subscription",
          subscription_data: {
            trial_period_days: 14,
          },
        });

        return {
          success: true,
          url: session.url,
        };
      } catch (err) {
        console.error("Error creating group or Stripe session:", err);
        return {
          success: false,
          message: "An error occurred while processing your request.",
        };
      }
    }),
  sync: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const members: any[] = [];

      const colony = await ctx.db.groups.findFirst({
        where: {
          id: `${input.id}`,
        },
      });

      if (!colony) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authorization has been denied for this request.",
        });
      }

      try {
        let res = await axios.get(
          `https://groups.roblox.com/v1/groups/${colony.groupId}/users?sortOrder=Asc&limit=100`,
        );

        res.data.data.forEach((member: any) => members.push(member));

        while (res.data.nextPageCursor) {
          res = await axios.get(
            `https://groups.roblox.com/v1/groups/${colony.groupId}/users?sortOrder=Asc&limit=100&cursor=${res.data.nextPageCursor}`,
          );
          res.data.data.forEach((member: any) => members.push(member));
        }

        return {
          data: members,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${err}`,
        });
      }
    }),
  roles: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const members: any[] = [];

      const colony = await ctx.db.groups.findFirst({
        where: {
          id: `${input.id}`,
        },
      });

      if (!colony) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authorization has been denied for this request.",
        });
      }

      try {
        let res = await axios.get(
          `https://groups.roblox.com/v1/groups/${colony.groupId}/roles`,
        );

        return {
          data: res.data.roles,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${err}`,
        });
      }
    }),
  edit: publicProcedure
    .input(
      z.object({ id: z.string(), color: z.string(), wallpaper: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const authCookie = cookies().get("hive_colony")?.value;

        if (!authCookie) {
          return {
            success: false,
            message: "Authorization has been denied for this request.",
          };
        }

        const auth = await getUser(authCookie);

        if (!auth) {
          return {
            success: false,
            message: "Authorization has been denied for this request.",
          };
        }

        const updateGroup = await ctx.db.groups.update({
          where: { id: input.id },
          data: {
            customisation: {
              color: `${input.color}`,
              wallpaper: `${input.wallpaper}`,
            },
          },
        });

        console.log(updateGroup);
        return {
          success: true,
        };
      } catch (err) {
        console.error("Error creating group or Stripe session:", err);
        return {
          success: false,
          message: "An error occurred while processing your request.",
        };
      }
    }),
  permissions: publicProcedure
    .input(
      z.object({
        id: z.string(),
        rankId: z.string(),
        permission: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const authCookie = cookies().get("hive_colony")?.value;

        if (!authCookie) {
          return {
            success: false,
            message: "Authorization has been denied for this request.",
          };
        }

        const auth = await getUser(authCookie);

        if (!auth) {
          return {
            success: false,
            message: "Authorization has been denied for this request.",
          };
        }

        const updateGroup = await ctx.db.groups.update({
          where: { id: input.id },
          data: {
            customisation: {
              color: `${input.color}`,
              wallpaper: `${input.wallpaper}`,
            },
          },
        });

        console.log(updateGroup);
        return {
          success: true,
        };
      } catch (err) {
        console.error("Error creating group or Stripe session:", err);
        return {
          success: false,
          message: "An error occurred while processing your request.",
        };
      }
    }),
});
