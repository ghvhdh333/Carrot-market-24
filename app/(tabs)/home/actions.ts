"use server";

import db from "@/lib/db";

export async function getMoreProductList(page: number) {
  const productList = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 10, // 만약 25개씩 보여준다면 page * 25로 하면됌
    take: 10, // 만약 25개씩 보여준다면 25로 하면됌
    orderBy: {
      created_at: "desc",
    },
  });
  return productList;
}
