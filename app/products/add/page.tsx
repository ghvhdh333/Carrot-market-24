"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import { IMAGE_MAX_SIZE } from "@/lib/constants";

export default function AddProduct() {
  const [state, action] = useFormState(uploadProduct, null);
  const [isImgSizeOk, setIsImgSizeOk] = useState(true);
  const [preview, setPreview] = useState("");

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 구조분해로 event.target.files 만 가져온다.
    // files = event.target.files와 같다.
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    // 파일 사이즈 크기 확인 (file < 3MB)
    if (file.size < IMAGE_MAX_SIZE) {
      setIsImgSizeOk(true);
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setIsImgSizeOk(false);
    }
  };
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-center text-neutral-400 text-sm flex flex-col gap-1 mt-1">
                <div>Please add a photo.</div>
                {/* server action photo error */}
                <div>{state?.fieldErrors.photo}</div>
                <div className="text-orange-500 font-semibold text-[16px]">
                  {/* file size error */}
                  {!isImgSizeOk
                    ? "Please check the file size."
                    : "The maximum file size is 3MB."}
                </div>
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="Title"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="Price"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="Description"
          errors={state?.fieldErrors.description}
        />
        <Button text="Upload" />
      </form>
    </div>
  );
}
