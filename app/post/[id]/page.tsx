import db from "@/lib/db";

import getSession from "@/lib/session/getSession";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/buttons/like-btn";

// post 정보를 가져온다.
async function getPostDetail(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPostDetail, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

// Db에서 해당 post에 likeCount와 특정유저가 like를 했는지를 가져온다.
async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

// postId, userId를 입력해주기 위해, function으로 한번 더 감쌌다.
// tag : [like-status]처럼하면 모든 post의 like 상태가 업데이트 되므로, 변경하려는 post만 변경되도록 postId를 입력해준다.
function getCachedLikeStatus(postId: number, userId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  // Number 타입으로 변경된 id가 숫자가 아닌 경우 -> 에러 페이지로 이동
  if (isNaN(id)) {
    console.log("aa");
    return notFound();
  }
  // id가 숫자이지만, session을 가져올 수 없는 경우(= 로그인하지 않은 경우) -> 에러 페이지로 이동
  const session = await getSession();
  if (!session.id) {
    console.log("bb");
    return notFound();
  }
  // id가 숫자이고, session도 가져올 수 있으나, post list를 가져올 수 없는 경우 -> 에러 페이지로 이동
  const post = await getCachedPost(id);
  if (!post) {
    console.log("cc");
    return notFound();
  }
  // getCachedLikeStatus에 postId, userId를 입력하여 likeCount, isLiked를 가져온다.
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <div>
          {post.user.avatar !== null ? (
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full"
              src={post.user.avatar!}
              alt={post.user.username}
            />
          ) : (
            <UserIcon className="size-7 rounded-full" />
          )}
        </div>
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
    </div>
  );
}
