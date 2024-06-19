"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function logOut() {
  const session = await getSession();
  await session.destroy();
  redirect("/");
}

// id === user.id
export async function onClickDeleteUser(id: number) {
  const productPhoto = await db.user.findMany({
    where: {
      id,
    },
    select: {
      products: {
        select: {
          photo: true,
        },
      },
    },
  });

  // flatMap : 평탄화
  // map : 요소들 값 변경
  const productPhotoIds = productPhoto.flatMap((user) =>
    user.products.map((product) => {
      const photoUrl = product.photo;
      // URL에서 "https://imagedelivery.net/U3ZvfSHMWBX1DnDWzDMR4A/" 이후의 문자열을 추출하여 id로 사용합니다.
      const id = photoUrl.split(
        "https://imagedelivery.net/U3ZvfSHMWBX1DnDWzDMR4A/"
      )[1];
      return id;
    })
  );

  // productPhotoIds를 순회하면서 순서대로 cloudflare의 이미지를 지운다.
  const deletePromises = productPhotoIds.map(async (photoId) => {
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
  });

  // Promise.all를 사용하여 모든 작업이 완료될 때까지 기다리도록 함
  await Promise.all(deletePromises);

  // 유저 정보 삭제
  await db.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  // session 삭제
  const session = await getSession();
  await session.destroy();

  // 캐시 최신화
  revalidateTag(`home-product-list`);
  revalidateTag(`life-post-list`);
  revalidateTag(`my-product-list`);
  revalidateTag(`my-post-list`);

  // redirect는 user delete btn에 있음
}
