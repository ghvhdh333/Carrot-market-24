"use server";

import db from "@/lib/db";

// delete 버튼
// 작성자인 경우에만 들어올 수 있으므로 따로 확인을 하지 않는다.
export async function onClickDeleteProduct(id: number) {
  const uploadedPhoto = await db.product.delete({
    where: {
      id,
    },
    select: {
      photo: true,
    },
  });

  const photoId = uploadedPhoto.photo.split(
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
}
