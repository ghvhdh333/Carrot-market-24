export default async function getGithubEmail(access_token: string) {
  // fetch는 메모리에 자동으로 캐시를 저장하므로 저장되지 않게 no-cache 사용하기
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const data = await userEmailResponse.json();

  let email = "";
  for (let el of data) {
    if (el.primary && el.verified) {
      email = el.email;
      break;
    }
  }
  return email;
}
