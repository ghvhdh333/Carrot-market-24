"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

interface ActionState {
  token: boolean;
}

// validator 라이브러리를 사용하여 전화번호 유효성 검사를 한다.
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

// input에 숫자로 입력해도 결과는 string으로 나오기 때문에,
// coerce.number()를 사용하여 number 타입으로 변경한다.
const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  // input에 입력한 전화번호 & 토큰의 값을 가져온다.
  const phone = formData.get("phone");
  const token = formData.get("token");
  // 토큰이 false일 때 (= 전화번호 입력받고 있는 중일 때)
  if (!prevState.token) {
    // 전화번호 유효성 검사
    const result = phoneSchema.safeParse(phone);
    // 전화번호 유효성 검사 실패한 경우 (= 전화번호 형식이 맞지 않는 전화번호를 입력한 경우)
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    }
    // 전화번호 유효성 검사 성공한 경우
    else {
      return {
        token: true,
      };
    }
  }
  // 토큰이 true일 때 (= 전화번호 유효성검사 통과한 경우)
  else {
    // 토큰 유효성 검사
    const result = tokenSchema.safeParse(token);
    // 토큰 유효성 검사 실패한 경우
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    }
    // 토큰 유효성 검사 성공한 경우
    else {
      redirect("/");
    }
  }
}
