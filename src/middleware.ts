import { auth } from "@/modules/common/next-auth";
import { NextResponse } from "next/server";

const shareRoutes = ["/dashboard/spaces/summary"];
const protectedRoutes = ["/dashboard"];

export default auth(async (req) => {
  // 공유 링크 접근 로직
  if (shareRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 로그인 하지 않은 사용자 접근 차단 로직
  if (
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) &&
    !req.auth?.user
  ) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("next", req.nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
