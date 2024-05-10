export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime(); // 밀리초(ms) 단위로 나옴
  const now = new Date().getTime(); // 밀리초(ms) 단위로 나옴
  const diff = Math.round((time - now) / dayInMs);

  // 3일 전 또는 3일 후 처럼 나옴
  const formatter = new Intl.RelativeTimeFormat("ko");
  if (formatter.format(diff, "days") === "0일 전") {
    return "오늘";
  } else {
    return formatter.format(diff, "days");
  }
}

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}
