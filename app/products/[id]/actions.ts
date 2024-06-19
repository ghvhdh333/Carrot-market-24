"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

// delete 버튼
// 작성자인 경우에만 들어올 수 있으므로 따로 확인을 하지 않는다.
export async function onClickDeleteProduct(id: number) {
  const product = await db.product.delete({
    where: {
      id,
    },
    select: {
      id: true,
      photo: true,
    },
  });

  const photoId = product.photo.split(
    "https://imagedelivery.net/U3ZvfSHMWBX1DnDWzDMR4A/"
  )[1];

  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  revalidateTag(`home-product-list`);
  revalidateTag(`product-detail-${product.id}`);
  revalidateTag(`product-title-${product.id}`);
  revalidateTag(`my-product-list`);
  // redirect는 product delete btn에 있음
}
