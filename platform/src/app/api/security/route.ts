import * as Sentry from "@sentry/react";
import fetch from "node-fetch";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

import { Castle } from "@castleio/sdk";
const castle = new Castle({ apiSecret: "" });

export const POST = async (req: NextRequest, res: NextResponse) => {
  console.log(req.body);
  return NextResponse.json({ data: "ok" });
};
