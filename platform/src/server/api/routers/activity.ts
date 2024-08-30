import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { useCallback } from "react";

export const activityRouter = createTRPCRouter({
  fetch: publicProcedure
    .input(z.object({ id: z.string(), user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.activity.findMany({
        orderBy: {
          end: "desc",
        },
        take: 15,
        where: {
          workspace: `${input.id}`,
          userId: `${input.user_id}`,
        },
      });
    }),
  fetchMessages: publicProcedure
    .input(z.object({ id: z.string(), user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.activity.findMany({
        orderBy: {
          end: "asc",
        },
        take: 30,
        where: {
          workspace: input.id,
          userId: `${input.user_id}`,
          ended: true,
        },
      });
    }),
  totals: publicProcedure
    .input(z.object({ id: z.string(), user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.activity.findMany({
        orderBy: {
          end: "asc",
        },
        take: 15,
        where: {
          workspace: input.id,
          userId: input.user_id,
          ended: true,
        },
      });

      let totalMinutes = 0;
      let messageCount = 0;

      data.forEach((doc) => {
        const startDate = new Date(`${doc.start}`);
        const endDate = new Date(`${doc.end}`);

        const differenceInMs = endDate.getTime() - startDate.getTime();
        const minutes = Math.floor(differenceInMs / (1000 * 60));
        const messages = doc.messages_sent!;
        messageCount += messages;
        totalMinutes += minutes;
      });

      // Calculate the average minutes per day
      let avgMinutesPerDay = 0;

      if (data.length > 0) {
        const firstDate = new Date(`${data[data.length - 1]!.start}`);
        const lastDate = new Date(`${data[0]!.end}`);
        const daysDifference =
          (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

        console.log(
          `Date range: from ${firstDate} to ${lastDate}, days difference: ${daysDifference}`,
        );

        avgMinutesPerDay =
          daysDifference > 0 ? totalMinutes / daysDifference : totalMinutes;
        avgMinutesPerDay = Math.ceil(avgMinutesPerDay); // Round up to the next whole number

        console.log(
          `Total minutes: ${totalMinutes}, Average minutes per day (rounded up): ${avgMinutesPerDay}`,
        );
      }

      return {
        amt: data.length,
        minutes: totalMinutes,
        messages: messageCount,
        avg: avgMinutesPerDay,
      };
    }),
  globalTotal: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.activity.findMany({
        where: {
          workspace: `${input.id}`,
          ended: false,
        },
      });
    }),
  findGlobals: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.activity.findMany({
        orderBy: {
          end: "asc",
        },
        take: 15,
        where: {
          workspace: input.id,
          ended: true,
        },
      });

      let totalMinutes = 0;
      let messageCount = 0;

      data.forEach((doc) => {
        const startDate = new Date(`${doc.start}`);
        const endDate = new Date(`${doc.end}`);

        const differenceInMs = endDate.getTime() - startDate.getTime();
        const minutes = Math.floor(differenceInMs / (1000 * 60));
        const messages = doc.messages_sent!;
        messageCount += messages;
        totalMinutes += minutes;
      });

      // Calculate the average minutes per day
      let avgMinutesPerDay = 0;

      if (data.length > 0) {
        const firstDate = new Date(`${data[data.length - 1]!.start}`);
        const lastDate = new Date(`${data[0]!.end}`);
        const daysDifference =
          (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

        console.log(
          `Date range: from ${firstDate} to ${lastDate}, days difference: ${daysDifference}`,
        );

        avgMinutesPerDay =
          daysDifference > 0 ? totalMinutes / daysDifference : totalMinutes;
        avgMinutesPerDay = Math.ceil(avgMinutesPerDay); // Round up to the next whole number

        console.log(
          `Total minutes: ${totalMinutes}, Average minutes per day (rounded up): ${avgMinutesPerDay}`,
        );
      }

      return {
        amt: data.length,
        minutes: totalMinutes,
        messages: messageCount,
        avg: avgMinutesPerDay,
      };
    }),
});
