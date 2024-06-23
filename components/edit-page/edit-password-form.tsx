"use client";

import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Button from "@/components/buttons/Button";
import { editPassword } from "@/app/edit/password/actions";

export default function EditPasswordForm() {
  const [state, action] = useFormState(editPassword, null);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold">비밀번호 변경</h1>
      <form action={action} className="flex flex-col gap-3">
        <Input
          required
          name="password"
          type="password"
          placeholder="Password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors?.password}
        />
        <Input
          required
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.confirm_password}
        />
        <Button text="Update account" />
      </form>
    </div>
  );
}
