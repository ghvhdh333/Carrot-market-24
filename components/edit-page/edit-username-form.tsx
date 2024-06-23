"use client";

import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";
import Button from "@/components/buttons/Button";
import { editUsername } from "@/app/edit/username/actions";

export default function EditUsernameForm() {
  const [state, action] = useFormState(editUsername, null);
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold">닉네임 변경</h1>
      <form action={action} className="flex flex-col gap-3">
        <Input
          required
          name="username"
          type="text"
          placeholder="Username"
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
          errors={state?.fieldErrors.username}
        />
        <Button text="Update account" />
      </form>
    </div>
  );
}
