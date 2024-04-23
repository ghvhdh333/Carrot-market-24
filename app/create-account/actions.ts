"use server";
import {
  USERNAME_INVALID_TYPE_ERROR,
  USERNAME_REQUIRED_ERROR,
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_ERROR,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_ERROR,
  EMAIL_INVALID_TYPE_ERROR,
  EMAIL_REQUIRED_ERROR,
  PASSWORD_INVALID_TYPE_ERROR,
  PASSWORD_REQUIRED_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  CONFIRM_PASSWORD_INVALID_TYPE_ERROR,
  CONFIRM_PASSWORD_REQUIRED_ERROR,
} from "@/lib/constants";

import bcrypt from "bcrypt";

import db from "@/lib/db";

import { z } from "zod";
import UpdateSession from "@/lib/session/updateSession";

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

    email: z
      .string({
        invalid_type_error: EMAIL_INVALID_TYPE_ERROR,
        required_error: EMAIL_REQUIRED_ERROR,
      })
      .email()
      .trim()
      .toLowerCase(),

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
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  // 이미 가입된 이메일이 있는지 확인
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  // 비밀번호와 비밀번호 확인의 값이 동일한지 확인
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Two passwords should be equal",
        path: ["confirm_password"],
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  // checkUniqueUsername, checkUniqueEmail을 확인하기 위해 async await를 사용한다.
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log("result data : ", result.data);

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // 서버에 유저 저장하기
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    // 쿠키 저장 및 로그인 후 프로필 페이지로 이동
    await UpdateSession(user.id);
  }
}
