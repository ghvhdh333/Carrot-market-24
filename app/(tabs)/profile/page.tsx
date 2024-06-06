import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { notFound } from "next/navigation";
import { logOut } from "./actions";

// 유저 정보 가져옴
async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  // 세션id가 없는 경우 (= 잘못된 경로로 접속한 경우), 에러 페이지 보여줌
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  return (
    <div className="p-5 mb-20">
      <div className="flex flex-row justify-between">
        <h1 className="flex flex-row gap-2 text-2xl font-semibold">
          <span className="text-orange-400">Welcome!</span>
          <span>{user?.username}</span>
        </h1>
        <form action={logOut}>
          <button className="bg-neutral-400 py-2 px-4 rounded-full font-semibold hover:bg-opacity-90">
            Log out
          </button>
        </form>
      </div>
      {/* <div>Edit</div> */}
    </div>
  );
}
