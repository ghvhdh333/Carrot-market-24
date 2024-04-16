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

import { z } from "zod";

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
      .toLowerCase(),

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
  const result = formSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log("result data : ", result.data);
  }
}
