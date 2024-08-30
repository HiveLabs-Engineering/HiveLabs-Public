import { Elysia, t } from "elysia";
import bearer from "@elysiajs/bearer";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { swagger } from "@elysiajs/swagger";
const app = new Elysia();

app.use(bearer());

import { getGameDetails } from "./services/game.service";
import {
  getGameThumbnail,
  getGroupThumbnail,
} from "./services/thumbnails.service";

async function getGroup(token: any) {
  const groupData = await prisma.groups.findFirstOrThrow({
    where: {
      id: `${token}`,
    },
  });

  return groupData;
}

app
  .use(
    swagger({
      path: "/v2/swagger",
      documentation: {
        tags: [
          { name: "App", description: "General endpoints" },
          { name: "Auth", description: "Authentication endpoints" },
        ],
      },
    })
  )
  .use(bearer())

  .group("/game", (app) =>
    app
      .get("/init", async ({ headers, set }) => {
        try {
          const auth = headers["authorization"];
          const data = await prisma.groups.findFirstOrThrow({
            where: {
              id: `${auth?.startsWith("Bearer ") ? auth.slice(7) : null}`,
            },
          });

          if (!data) {
            set.status = 400;
            return "Secret key not found.";
          }

          return await getGroup(data.id);
        } catch (err) {
          set.status = 400;
          return `${err}`;
        }
      })
      .post("/track", async ({ body, headers }: any) => {
        const auth = headers["authorization"];

        const data = await prisma.groups.findFirstOrThrow({
          where: {
            id: `${auth?.startsWith("Bearer ") ? auth.slice(7) : null}`,
          },
        });

        if (!data) {
          throw new Error("Secret key not found");
        }

        try {
          if (!body.userId || !body.gameId) {
            return { status: 404, msg: "Failed to initialize Activity Pulse." };
          } else if (!auth) {
            return { status: 400, msg: "Unauthorized" };
          }

          const d = new Date();
          const gameService = await getGameDetails(`${body.gameId}`);
          const thumbnailService = await getGameThumbnail(`${gameService.id}`);

          await prisma.activity.create({
            data: {
              workspace: `${auth.slice(7)}`,
              userId: `${body.userId}`,
              start: `${d.toString()}`,
              ended: false,
              game: `${body.gameId}`,
              game_details: {
                id: `${gameService.id}`,
                name: `${gameService.name}`,
                thumbnail: `${thumbnailService}`,
                url: `https://www.roblox.com/games/${body.gameId}`,
              },
            },
          });
        } catch (err) {
          return { status: 404, msg: `${err}` };
        }
      })
      .delete("/end", async ({ body, headers }: any) => {
        const auth = headers["authorization"];

        const data = await prisma.groups.findFirstOrThrow({
          where: {
            id: `${auth?.startsWith("Bearer ") ? auth.slice(7) : null}`,
          },
        });

        if (!data) {
          throw new Error("Secret key not found");
        }

        if (!body.userId) {
          return { status: 404, msg: "Failed to end activity session." };
        } else if (!auth) {
          return { status: 400, msg: "Unauthorized" };
        }

        const session = await prisma.activity.findFirstOrThrow({
          where: {
            userId: `${body.userId}`,
            ended: false,
          },
        });

        const d = new Date();

        await prisma.activity.update({
          where: {
            id: `${session.id}`,
            ended: false,
          },
          data: {
            end: `${d.toString()}`,
            messages_sent: body.messages_sent,
            ended: true,
          },
        });

        return { status: 400, msg: "Success" };
      })
  )

  .group("/colony", (app) =>
    app.post("/sync", async ({ body, headers }: any) => {
      const auth = headers["authorization"];

      const data = await prisma.groups.findFirstOrThrow({
        where: {
          id: `${auth.slice(7)}`,
        },
      });

      if (!data || !auth) {
        return { status: 400, msg: "Unauthorized" };
      }

      try {
        const fetch = await prisma.groups.findFirst({
          where: {
            id: `${body.id}`,
          },
        });

        if (Array.isArray(fetch?.tracking)) {
          fetch.tracking.forEach((number) => {
            console.log(number);
          });
        } else {
          console.error("result.tracking is not an array");
        }
      } catch (err) {
        return { status: 404, msg: `${err}` };
      }
    })
  )

  .group("/thumb", (app) =>
    app.get("/groups/:id", async ({ params: { id }, set }) => {
      try {
        return await getGroupThumbnail(id);
      } catch (err) {
        set.status = 400;
        return "Error";
      }
    })
  )

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
