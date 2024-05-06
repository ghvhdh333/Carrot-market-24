"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1, // 만약 25개씩 보여준다면 page * 25로 하면됌
    take: 1, // 만약 25개씩 보여준다면 25로 하면됌
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
