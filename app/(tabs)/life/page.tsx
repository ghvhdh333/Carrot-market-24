import db from "@/lib/db";
import { unstable_cache as nextCache } from "next/cache";
import AddBtn from "@/components/buttons/add-btn";
import PostList from "@/components/life-page/post-list";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Life",
};

const getCachePostList = nextCache(getInitialPostList, ["post-list"], {
  tags: ["post-list"],
});

// Life 페이지에서 처음 가져오는 postList
async function getInitialPostList() {
  const postList = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    take: 10, // take에 적힌 수 만큼 상품 리스트 가져옴
    orderBy: {
      created_at: "desc", // 최신 순으로 정렬함
    },
  });
  return postList;
}

// getInitialPostList의 타입 입력 (interface로 해도 됌)
export type InitialPostList = Prisma.PromiseReturnType<
  typeof getInitialPostList
>;

export default async function Life() {
  const initialPostList = await getCachePostList();
  return (
    <div>
      <PostList initialPostList={initialPostList} />
      <AddBtn link={"/add/post"} />
    </div>
  );
}
