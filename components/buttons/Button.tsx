"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}
// const { pending, data, method, action } = useFormStatus();
// useFormStatus는 마지막 form submit의 상태 정보를 제공하는 Hook입니다.
// form의 자식으로만 사용해야 합니다.

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "Loading" : text}
    </button>
  );
}
