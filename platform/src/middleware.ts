import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("hive_colony")?.value;

  if (!token) {
    return NextResponse.redirect("http://localhost:3000");
  }

  try {
    const response = await fetch("http://localhost:3001/api/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    if (data.banned) {
      if (!pathname.includes("notice")) {
        return NextResponse.redirect("http://localhost:3001/notice");
      }
    } else {
      if (pathname.includes("notice")) {
        return NextResponse.redirect("http://localhost:3001/waitlist");
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
