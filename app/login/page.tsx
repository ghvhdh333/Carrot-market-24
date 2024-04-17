"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { logInForm } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function LogIn() {
  // useFormState는 form action의 결과에 따라 상태를 업데이트할 수 있는 Hook입니다.
  // state는 formData와 함께 호출되는데, 처음에는 초기값 state와 함께 호출되고,
  // 그 다음부터는 이전 action에서 return된 state와 함께 호출된다.
  // const [state, formAction] = useFormState(fn, initialState, permalink?);
  const [state, action] = useFormState(logInForm, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          // input에 name을 설정하지 않으면, action에 필요한 data가 formData에 포함되지 않는다.
          required
          name="email"
          type="email"
          placeholder="Email"
          errors={state?.fieldErrors.email}
        />
        <Input
          required
          name="password"
          type="password"
          placeholder="Password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Button text="Log In" />
      </form>
      <SocialLogin />
    </div>
  );
}
