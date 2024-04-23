interface GithubProfileResponse {
  id: number;
  avatar_url: string;
  login: string; // <-- username과 같다.
}

export default async function getGithubProfile(
  access_token: string
): Promise<GithubProfileResponse> {
  // fetch는 메모리에 자동으로 캐시를 저장하므로 저장되지 않게 no-cache 사용하기
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const { id, avatar_url, login } = await userProfileResponse.json();
  return { id, avatar_url, login };
}
