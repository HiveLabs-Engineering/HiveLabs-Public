import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, User } from "@prisma/client";
import { jwtVerify } from "jose";
import { getJwtSecretKey } from "~/services";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authorization header missing or malformed" },
      { status: 401 },
    );
  }

  const token = authHeader.substring(7);

  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 401 });
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey()),
    );

    const user = (await prisma.user.findFirst({
      where: {
        userId: `${verified.payload.userId}`,
      },
    })) as User;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    } else if (user.disabled) {
      return NextResponse.json({ banned: true }, { status: 401 });
    }

    return NextResponse.json({ data: user, banned: false });
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
