export default async function getGithubAccessToken(code: string) {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  // github가 사용자를 사이트로 다시 리디렉션
  // 유효한 코드로 접근한 경우 : 토큰 발급
  // 만료된 코드로 접근한 경우 : 에러 발생
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const { error, access_token } = await accessTokenResponse.json();
  return { error, access_token };
}
