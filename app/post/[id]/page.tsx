import db from "@/lib/db";

import getSession from "@/lib/session/getSession";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/buttons/like-btn";
import EditBtn from "@/components/buttons/edit-btn";
import PostDeleteBtn from "@/components/life-page/post-delete-btn";
import Link from "next/link";
import { NewspaperIcon } from "@heroicons/react/24/outline";

async function getPostTitle(id: number) {
  const post = await db.post.findUnique({
    where: { id },
    select: {
      title: true,
    },
  });
  return post;
}

function getCachedPostTitle(postId: number) {
  const cachedOperation = nextCache(getPostTitle, [`post-title-${postId}`], {
    revalidate: 60,
    tags: [`post-title-${postId}`],
  });
  return cachedOperation(postId);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getCachedPostTitle(Number(params.id));
  return {
    title: post?.title,
  };
}

// 쿠키에 있는 id가 제품을 업로드한 사용자의 id와 일치하는지 확인한다.
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

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
function getCachedPostDetail(postId: number) {
  const cachedOperation = nextCache(getPostDetail, [`post-detail-${postId}`], {
    revalidate: 60,
    tags: [`post-detail-${postId}`],
  });
  return cachedOperation(postId);
}
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
  const cachedOperation = nextCache(getLikeStatus, [`like-status-${postId}`]);
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
    return notFound();
  }
  // id가 숫자이지만, session을 가져올 수 없는 경우(= 로그인하지 않은 경우) -> 에러 페이지로 이동
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }
  // id가 숫자이고, session도 가져올 수 있으나, post list를 가져올 수 없는 경우 -> 에러 페이지로 이동
  const post = await getCachedPostDetail(id);
  if (!post) {
    return notFound();
  }

  const isOwner = await getIsOwner(post.userId);

  // getCachedLikeStatus에 postId, userId를 입력하여 likeCount, isLiked를 가져온다.
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);

  return (
    <div className="p-5 text-white">
      <Link
        href={"/life"}
        className="w-10 h-10 flex flex-row justify-center items-center bg-orange-400 rounded-full hover:bg-opacity-90"
      >
        <NewspaperIcon className="text-white w-8 h-8 " />
      </Link>
      <div className="flex flex-row justify-between items-center pt-5">
        <div className="flex flex-row items-center gap-2 mb-2">
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

        {isOwner ? (
          <div className="flex flex-row gap-4">
            <EditBtn link={`/edit/post/${id}`} />
            <PostDeleteBtn id={id} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 mt-3 mb-5">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <p>{post.description}</p>
      </div>
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
