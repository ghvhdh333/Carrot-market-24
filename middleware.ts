import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/getSession";

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
  // 세션 가져옴
  const session = await getSession();
  // 로그아웃 상태
  if (!session.id) {
    // 로그아웃 상태 & publicOnlyUrls에 포함되지 않는 경우, ('/') 페이지로 이동시킴
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  // 로그인 상태
  else {
    // 로그인 상태 & publicOnlyUrls에 포함된 경우, ('/home') 페이지로 이동시킴
    if (exists) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

// 특정 url에 미들웨어가 동작 하도록 설정함
// ex) matcher: ['profile', '/about/:path*', '/dashboard/:path*']

// _next/static, _next/image, images, favicon.ico로 시작하지 않는 모든 경로에 대해 미들웨어를 실행하도록 합니다.
export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};
