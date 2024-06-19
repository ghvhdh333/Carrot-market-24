"use server";

import db from "@/lib/db";

// id === user.id
export async function getMyPosts(id: number) {
  const myPosts = await db.user.findMany({
    where: {
      id,
    },
    select: {
      posts: {
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
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return myPosts;
}
