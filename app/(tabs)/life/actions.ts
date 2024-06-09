"use server";

import db from "@/lib/db";

// 추가로 데이터를 더 가져올 때
export async function getMorePostList(page: number) {
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
    skip: page * 10, // 만약 25개씩 보여준다면 page * 25로 하면됌
    take: 10, // 만약 25개씩 보여준다면 25로 하면됌
    orderBy: {
      created_at: "desc", // 최신 순
    },
  });
  return postList;
}
