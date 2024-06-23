"use server";

import {
  EMAIL_INVALID_TYPE_ERROR,
  EMAIL_NOT_EXIST_ERROR,
  EMAIL_REQUIRED_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import UpdateSession from "@/lib/session/updateSession";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string({
      invalid_type_error: EMAIL_INVALID_TYPE_ERROR,
      required_error: EMAIL_REQUIRED_ERROR,
    })
    .email()
    .trim()
    .toLowerCase()
    .refine(checkEmailExists, EMAIL_NOT_EXIST_ERROR),

  password: z
    .string({
      required_error: PASSWORD_REQUIRED_ERROR,
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function logInForm(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // 유저의 이메일을 찾는다.
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    // 만약 유저를 찾았다면, 입력한 비밀번호와 db의 비밀번호를 비교한다.
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");

    // 비밀번호가 일치하면 로그인을 시킨다.
    if (ok) {
      // 로그인 후 프로필 페이지로 이동한다.
      await UpdateSession(user!.id);
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["잘못된 비밀번호입니다."],
          email: [],
        },
      };
    }
  }
}
