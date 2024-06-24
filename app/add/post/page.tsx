"use client";

import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import { uploadPost } from "./actions";
import { useFormState } from "react-dom";
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/constants";

export default function AddProduct() {
  const [state, action] = useFormState(uploadPost, null);

  return (
    <div className="p-5 flex flex-col gap-5">
      <h1 className="text-xl font-semibold">게시물 추가하기</h1>
      <form action={action} className="flex flex-col gap-5">
        <Input
          name="title"
          required
          placeholder="Title"
          type="text"
          minLength={TITLE_MIN_LENGTH}
          maxLength={TITLE_MAX_LENGTH}
          errors={state?.fieldErrors.title}
        />
        <div className="flex flex-col gap-2">
          <textarea
            name="description"
            placeholder="Description"
            minLength={DESCRIPTION_MIN_LENGTH}
            maxLength={DESCRIPTION_MAX_LENGTH}
            className="bg-transparent rounded-md w-full h-60 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
          />
          <div className="text-red-500 font-medium">
            {state?.fieldErrors.description}
          </div>
        </div>
        <Button text="Upload" />
      </form>
    </div>
  );
}
