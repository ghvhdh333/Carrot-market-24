import db from "@/lib/db";
import UpdateSession from "@/lib/session/updateSession";
import { NextRequest } from "next/server";
import getGithubAccessToken from "../getGithubAccessToken";
import getGithubProfile from "../getGithubProfile";
import getGithubEmail from "../getGithubEmail";
import { redirect } from "next/navigation";

// github 소셜로그인 요청이 성공적으로 되면 url에 코드를 가져온다.
// ex) http://localhost:3000/github/complete?code=fsafsdafas
// 코드 유효기간 : 10분
export async function GET(request: NextRequest) {
  // url에 있는 code를 가져온다.
  const code = request.nextUrl.searchParams.get("code");
  // 코드가 없는 경우 (= 잘못된 경로로 접속하는 경우)
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  // accessToken을 가져온다.
  const { error, access_token } = await getGithubAccessToken(code);
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  // github 유저 프로필 데이터 가져오기
  const { id, avatar_url, login } = await getGithubProfile(access_token);

  // github 유저 이메일 데이터 가져오기
  const email = await getGithubEmail(access_token);

  // 기존에 github로 가입한 유저인지 확인한다.
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  // 기존에 github로 가입한 유저라면
  if (user) {
    // 로그인 후 프로필 페이지로 이동한다.
    await UpdateSession(user.id);
    redirect("/profile");
  }
  // github 소셜로그인으로 처음 가입한 유저라면
  // 계정을 새로 등록한다.
  else {
    const newUser = await db.user.create({
      data: {
        username: login + "-gh",
        email,
        github_id: id + "",
        avatar: avatar_url,
      },
      select: {
        id: true,
      },
    });
    // 로그인 후 프로필 페이지로 이동한다.
    await UpdateSession(newUser.id);
    redirect("/profile");
  }
}
