import { getRobloxContext, getTokens } from "~/lib/auth.services";
import fetch from "node-fetch";
import { nanoid } from "nanoid";
import crypto from "crypto";

import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
const prisma = new PrismaClient();

import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const code = params.get("code");

  const headers: Record<string, string> = {};
  req.headers.forEach((value: string, key: string) => {
    headers[key] = value;
  });

  if (!code) {
    return new Response("No authorization code provided.");
  }

  const tokens = await getTokens(code);
  if (!tokens) {
    throw new Error("Unable to fetch tokens");
  }

  const userInfo = await getRobloxContext(tokens.access_token);
  if (!userInfo) {
    throw new Error("Unable to load user information");
  }

  const [record, _] = await Promise.all([
    prisma.user.upsert({
      where: { userId: userInfo.sub },
      update: {},
      create: {
        userId: userInfo.sub,
        username: userInfo.name,
        email: "",
        tunables: {
          waitlist: true,
          access: false,
        },
      },
    }),
    submitMsg(
      `${userInfo.name} (${userInfo.sub}) has logged into **HiveLabs Platform**`,
    ),
  ]);

  const token = await new SignJWT({
    userId: userInfo.sub,
    intercom: crypto
      .createHmac("sha256", "Iul2OLq_SgJ_K4QTW24p-E4K0wnv5zyxwTXCceY4")
      .update(`${userInfo.sub}`)
      .digest("hex"),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(process.env.JWT_TOKEN));

  return new Response(token, {
    headers: {
      "Set-Cookie": `hive_colony=${token}; Max-Age=3000000; Path=/; HttpOnly`,
      Location: "https://platform.hivelabs.app/waitlist",
    },
    status: 302,
  });
};

async function submitMsg(msg: string) {
  return;
}
