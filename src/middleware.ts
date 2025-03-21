import { auth } from "@/auth";

// 로그인을 하지 않은 사용자가 접근할 수 없는 페이지
const protectedRoutes = ["/protected"];

export default auth(async (req) => {
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
