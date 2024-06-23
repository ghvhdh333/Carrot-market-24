"use server";

import {
  PASSWORD_INVALID_TYPE_ERROR,
  PASSWORD_REQUIRED_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  CONFIRM_PASSWORD_INVALID_TYPE_ERROR,
  CONFIRM_PASSWORD_REQUIRED_ERROR,
  TWO_PASSWORDS_NOT_EQUAL_ERROR,
} from "@/lib/constants";

import bcrypt from "bcrypt";

import db from "@/lib/db";

import { z } from "zod";
import UpdateSession from "@/lib/session/updateSession";
import { redirect } from "next/navigation";
import getSession from "@/lib/session/getSession";
import { revalidateTag } from "next/cache";

const formSchema = z
  .object({
    password: z
      .string({
        invalid_type_error: PASSWORD_INVALID_TYPE_ERROR,
        required_error: PASSWORD_REQUIRED_ERROR,
      })
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),

    confirm_password: z
      .string({
        invalid_type_error: CONFIRM_PASSWORD_INVALID_TYPE_ERROR,
        required_error: CONFIRM_PASSWORD_REQUIRED_ERROR,
      })
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR),
  })

  // 비밀번호와 비밀번호 확인의 값이 동일한지 확인
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: TWO_PASSWORDS_NOT_EQUAL_ERROR,
        path: ["confirm_password"],
      });
    }
  });

export async function editPassword(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = session.id;

  const data = {
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  // checkUniqueUsername, checkUniqueEmail을 확인하기 위해 async await를 사용한다.
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // 서버에 유저 저장하기
    const user = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
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
