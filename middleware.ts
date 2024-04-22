import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

// 미들웨어 : 클라이언트와 서버의 중간에서 작업하는 역할
export async function middleware(request: NextRequest) {
  // 현재 위치가 publicOnlyUrls에 포함되는지 T/F
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  const session = await getSession();
  // 로그아웃 상태
  if (!session.id) {
    // 로그아웃 & publicOnlyUrls에 포함되지 않는 경우, 메인 페이지로 이동시킴
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  // 로그인 상태
  else {
    // 로그인 & publicOnlyUrls에 포함된 경우, 상품 페이지로 이동시킴
    if (exists) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

// 특정 url에 미들웨어가 동작 하도록 설정함
// ex) matcher: ['profile', '/about/:path*', '/dashboard/:path*']
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
