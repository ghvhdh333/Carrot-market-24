"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function LogIn() {
  // useFormState는 form action의 결과에 따라 상태를 업데이트할 수 있는 Hook입니다.
  // state는 formData와 함께 호출되는데, 처음에는 초기값 state와 함께 호출되고,
  // 그 다음부터는 이전 action에서 return된 state와 함께 호출된다.
  // const [state, formAction] = useFormState(fn, initialState, permalink?);
  const [state, action] = useFormState(handleForm, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          // input에 name을 설정하지 않으면, action에 필요한 data가 formData에 포함되지 않는다.
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
