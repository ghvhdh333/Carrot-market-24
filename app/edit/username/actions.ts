"use server";

import {
  USERNAME_INVALID_TYPE_ERROR,
  USERNAME_REQUIRED_ERROR,
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_ERROR,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_ERROR,
  ALREADY_EXISTS_ERROR,
} from "@/lib/constants";

import db from "@/lib/db";

import { z } from "zod";
import UpdateSession from "@/lib/session/updateSession";
import { notFound, redirect } from "next/navigation";
import getSession from "@/lib/session/getSession";
import { revalidateTag } from "next/cache";

// 특정 문자 입력금지
const checkUsername = (username: string) => !username.includes("potato");

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: USERNAME_INVALID_TYPE_ERROR,
        required_error: USERNAME_REQUIRED_ERROR,
      })
      .min(USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR)
      .max(USERNAME_MAX_LENGTH, USERNAME_MAX_LENGTH_ERROR)
      .trim()
      .toLowerCase()
      .refine(checkUsername, "No potatoes allowed!"),
  })
  // 이미 가입된 유저이름이 있는지 확인
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: ALREADY_EXISTS_ERROR,
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export async function editUsername(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = session.id;

  const data = {
    username: formData.get("username"),
  };

  // checkUniqueUsername, checkUniqueEmail을 확인하기 위해 async await를 사용한다.
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // 서버에 유저 저장하기
    const user = await db.user.update({
      where: {
        id,
      },
      data: {
        username: result.data.username,
      },
      select: {
        id: true,
      },
    });

    // 쿠키 저장 및 로그인
    await UpdateSession(user.id);

    // 모든 캐시 업데이트하기
    revalidateTag("home-product-list");
    revalidateTag("my-product-list");
    revalidateTag("product-detail");
    revalidateTag("product-title");

    revalidateTag("life-post-list");
    revalidateTag("my-post-list");
    revalidateTag("post-detail");
    revalidateTag("post-title");

    // 프로필 페이지로 이동
    redirect("/profile");
  }
}
