"use server";

import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { redirect } from "next/navigation";
import {
  PHOTO_REQUIRED_ERROR,
  PHOTO_INVALID_TYPE_ERROR,
  TITLE_REQUIRED_ERROR,
  TITLE_INVALID_TYPE_ERROR,
  TITLE_MIN_LENGTH,
  TITLE_MIN_LENGTH_ERROR,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_ERROR,
  DESCRIPTION_REQUIRED_ERROR,
  DESCRIPTION_INVALID_TYPE_ERROR,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MIN_LENGTH_ERROR,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH_ERROR,
  PRICE_REQUIRED_ERROR,
  PRICE_INVALID_TYPE_ERROR,
  PRICE_MIN,
  PRICE_MIN_ERROR,
  PRICE_MAX,
  PRICE_MAX_ERROR,
} from "@/lib/constants";
import { revalidateTag } from "next/cache";

const productSchema = z.object({
  id: z.coerce.number(),
  photo: z.string({
    required_error: PHOTO_REQUIRED_ERROR,
    invalid_type_error: PHOTO_INVALID_TYPE_ERROR,
  }),
  title: z
    .string({
      required_error: TITLE_REQUIRED_ERROR,
      invalid_type_error: TITLE_INVALID_TYPE_ERROR,
    })
    .min(TITLE_MIN_LENGTH, TITLE_MIN_LENGTH_ERROR)
    .max(TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_ERROR),
  description: z
    .string({
      required_error: DESCRIPTION_REQUIRED_ERROR,
      invalid_type_error: DESCRIPTION_INVALID_TYPE_ERROR,
    })
    .min(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MIN_LENGTH_ERROR)
    .max(DESCRIPTION_MAX_LENGTH, DESCRIPTION_MAX_LENGTH_ERROR),
  price: z.coerce
    .number({
      required_error: PRICE_REQUIRED_ERROR,
      invalid_type_error: PRICE_INVALID_TYPE_ERROR,
    })
    .min(PRICE_MIN, PRICE_MIN_ERROR)
    .max(PRICE_MAX, PRICE_MAX_ERROR),
});

export async function editProduct(_: any, formData: FormData) {
  const data = {
    id: formData.get("id"),
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) return result.error.flatten();

  const session = await getSession();
  if (!session.id) return;

  const oldProduct = await db.product.findUnique({
    where: {
      id: result.data.id,
    },
    select: {
      photo: true,
    },
  });

  const newProduct = await db.product.update({
    where: {
      id: result.data.id,
    },
    data: {
      title: result.data.title,
      description: result.data.description,
      price: result.data.price,
      photo: result.data.photo,
      user: {
        connect: {
          id: session.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  // 수정 전 클라우드에 저장된 이미지 삭제
  await deleteProductCloudImg(oldProduct!.photo);

  // 캐시 재검증
  revalidateTag(`home-product-list`);
  revalidateTag(`product-detail-${newProduct.id}`);
  revalidateTag(`product-title-${newProduct.id}`);
  revalidateTag(`my-product-list`);

  // 리다이렉트
  redirect(`/products/${newProduct.id}`);
}

async function deleteProductCloudImg(oldProductPhotoUrl: string) {
  const oldProductPhotoId = oldProductPhotoUrl.split(
    "https://imagedelivery.net/U3ZvfSHMWBX1DnDWzDMR4A/"
  )[1];

  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${oldProductPhotoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
}

// 수정 전 상품 데이터 가져옴
export async function getProduct(id: number) {
  const oldProduct = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
      photo: true,
      userId: true,
    },
  });
  return oldProduct;
}

// cloudflare의 새로운 업로드 url 가져옴
export async function getCloudflareUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
