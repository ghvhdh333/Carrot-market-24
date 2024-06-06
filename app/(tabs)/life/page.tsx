import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterTextIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";
import AddBtn from "@/components/buttons/add-btn";

const getCachePosts = nextCache(getPosts, ["life-posts"], {
  revalidate: 30,
});

async function getPosts() {
  const posts = await db.post.findMany({
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
  });
  return posts;
}

export const metadata = {
  title: "Life",
};

export default async function Life() {
  const posts = await getCachePosts();
  return (
    <div>
      <div className="p-5 flex flex-col mb-20">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
          >
            <h2 className="text-white text-lg font-semibold">{post.title}</h2>
            <p>{post.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4 items-center">
                <span>{formatToTimeAgo(post.created_at.toString())}</span>
                <span>·</span>
                <span>조회 {post.views}</span>
              </div>
              <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
                <span>
                  <HandThumbUpIcon className="size-4" />
                  {post._count.likes}
                </span>
                <span>
                  <ChatBubbleBottomCenterTextIcon className="size-4" />
                  {post._count.comments}
                </span>
              </div>
            </div>
          </Link>
          // 무한스크롤 할 수 있게 만들기! (product 페이지 처럼)
        ))}
      </div>
      <AddBtn link={"/add/post"} />
    </div>
  );
}
