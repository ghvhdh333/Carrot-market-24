import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { notFound } from "next/navigation";
import { logOut } from "./actions";
import { CubeIcon, NewspaperIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import UserDeleteBtn from "@/components/buttons/user-delete-btn";

export const metadata = {
  title: "Profile",
};

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
  const githubId = user.github_id;

  return (
    <div className="p-5 mb-20">
      <section className="flex flex-row justify-between mb-10">
        <h1 className="flex flex-row gap-2 text-2xl font-semibold">
          <span className="text-orange-400">Welcome</span>
          <span>{user?.username} 🥕</span>
        </h1>
        <form action={logOut}>
          <button className="bg-neutral-400 py-2 px-4 rounded-full font-semibold hover:bg-opacity-90">
            로그아웃
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-8 text-xl">
        {/* Github 유저가 아닌 경우, 프로필 편집 가능 */}
        {!githubId ? (
          <section className="flex flex-row">
            <Link
              href={`/edit/profile/${user.id}`}
              className="flex flex-row gap-2 items-center text-white hover:text-orange-400 active:text-orange-300"
            >
              <UserIcon className="w-7 h-7" />
              프로필 편집
            </Link>
          </section>
        ) : null}
        <section className="flex flex-row">
          <Link
            href={`/my/products`}
            className="flex flex-row gap-2 items-center text-white hover:text-orange-400 active:text-orange-300 cursor-pointer"
          >
            <CubeIcon className="w-7 h-7" />
            나의 상품들
          </Link>
        </section>
        <section className="flex flex-row">
          <Link
            href={`/my/posts`}
            className="flex flex-row gap-2 items-center text-white hover:text-orange-400 active:text-orange-300 cursor-pointer"
          >
            <NewspaperIcon className="w-7 h-7" />
            나의 게시물들
          </Link>
        </section>
      </section>

      {/* 회원 탈퇴 버튼을 만들고, 재차 확인 버튼을 만들기! */}
      <section className="mt-20">
        <UserDeleteBtn id={user.id} />
      </section>
    </div>
  );
}
