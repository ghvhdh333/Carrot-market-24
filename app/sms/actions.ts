"use server";

import { z } from "zod";
import validator from "validator";
import crypto from "crypto";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import UpdateSession from "@/lib/session/updateSession";
import twilio from "twilio";

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

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

// input에 숫자로 입력해도 결과는 string으로 나오기 때문에,
// coerce.number()를 사용하여 number 타입으로 변경한다.
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");

async function getToken() {
  // 토큰 코드 생성
  const token = crypto.randomInt(100000, 999999).toString();
  // 지금 발행된 토큰과 이미 발급된 동일한 코드가 있는지 확인
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  // 이미 발급된 동일한 코드가 있다면, 함수 재실행
  if (exists) {
    return getToken();
  }
  // 겹치는 코드가 없다면 토큰 코드 발급
  else {
    return token;
  }
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  // input에 입력한 전화번호 & 토큰의 값을 가져온다.
  const phone = formData.get("phone");
  const token = formData.get("token");
  // 토큰이 false일 때 (= 전화번호 입력받고 있는 중일 때)
  if (!prevState.token) {
    // 전화번호 유효성 검사
    const result = phoneSchema.safeParse(phone);
    // 전화번호 유효성 검사 실패한 경우 (= 전화번호 형식에 맞지 않는 전화번호를 입력한 경우)
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    }
    // 전화번호 유효성 검사 성공한 경우
    else {
      // 이전 토큰 삭제하기
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      // 새 토큰 생성하기
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              // db에서 입력한 전화번호와 일치하는 전화번호 데이터가 있으면 db와 token을 연결시켜주고,
              where: {
                phone: result.data,
              },
              // 없으면 새로 유저이름을 랜덤한 문자열로 주면서 만들고, token과 연결시켜준다.
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // twilio를 사용해서 토큰 보내주기
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Your Carrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!,
      });

      return {
        token: true,
      };
    }
  }
  // 토큰이 true일 때 (= 전화번호 유효성검사 통과한 경우)
  else {
    // 토큰 유효성 검사
    const result = await tokenSchema.safeParseAsync(token);
    // 토큰 유효성 검사 실패한 경우
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    }
    // 토큰 유효성 검사 성공한 경우
    else {
      // 토큰에 연결된 유저 찾기
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      // 로그인
      await UpdateSession(token!.userId);
      // 유저에 연결된 토큰 삭제하기
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      // 프로필 페이지로 이동하기
      redirect("/profile");
    }
  }
}
