"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { smsVerification } from "./actions";

export default function SMSLogin() {
  const [state, action] = useFormState(smsVerification, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Log in</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form className="flex flex-col gap-3">
        <Input required name="phone" type="number" placeholder="Phone number" />
        <Input
          required
          name="token"
          type="number"
          placeholder="Verification code"
        />
        <Button text="Verify" />
      </form>
    </div>
  );
}
