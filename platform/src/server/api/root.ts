import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";
import { spacesRouter } from "./routers/spaces";
import { billingRouter } from "./routers/billing";
import { activityRouter } from "./routers/activity";
import { colonyRouter } from "./routers/colony";
import { security } from "./routers/security";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  spaces: spacesRouter,
  billing: billingRouter,
  activity: activityRouter,
  colony: colonyRouter,
  security: security,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
