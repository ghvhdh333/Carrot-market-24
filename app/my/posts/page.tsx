import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { notFound } from "next/navigation";
import { getMyPosts } from "./actions";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";
import PostSimpleInfo from "@/components/life-page/post-simple-info";
import { NewspaperIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "My Posts",
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

const getCachePostList = nextCache(getMyPosts, ["my-post-list"], {
  tags: ["my-post-list"],
  revalidate: 60,
});

export default async function MyPosts() {
  const user = await getUser();
  const myPosts = await getCachePostList(user.id);

  return (
    <div className="p-5 flex flex-col">
      <h1 className="font-semibold text-xl mb-3">나의 게시물들</h1>
      {myPosts[0].posts.length === 0 ? (
        <section className="bg-neutral-700 w-full h-52 rounded-lg text-white flex flex-col justify-center items-center gap-3 mt-5">
          <div>등록 내역이 없습니다.</div>
          <Link
            href={"/life"}
            className="text-white bg-orange-500 rounded-full px-3 py-1 hover:bg-opacity-90 font-semibold"
          >
            게시물 보러가기
          </Link>
        </section>
      ) : (
        <div>
          {myPosts[0].posts.map((post) => (
            <PostSimpleInfo key={post.id} {...post} />
          ))}
          <Link
            href={"/life"}
            className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-8 right-8 text-white transition-colors hover:bg-orange-400"
          >
            <NewspaperIcon className="size-10" />
          </Link>
        </div>
      )}
    </div>
  );
}
