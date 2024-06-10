"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/getSession";

import { revalidateTag } from "next/cache";

// 좋아요
export async function likePost(postId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

// 좋아요 취소
export async function dislikePost(postId: number) {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

// delete 버튼
// 작성자인 경우에만 들어올 수 있으므로 따로 확인을 하지 않는다.
export async function onClickDeletePost(id: number) {
  await db.post.delete({
    where: {
      id,
    },
  });
}
