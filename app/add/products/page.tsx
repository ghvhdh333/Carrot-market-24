"use client";

import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  IMAGE_MAX_SIZE,
  PRICE_MAX,
  PRICE_MIN,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/constants";

export default function AddProduct() {
  const [isImgSizeOk, setIsImgSizeOk] = useState(true);
  const [preview, setPreview] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      // cloudflare에서 upload URL를 가져온다.
      const { success, result } = await getUploadUrl();
      if (success) {
        const { id, uploadURL } = result;
        setUploadUrl(uploadURL);
        setPhotoId(id);
      }
    } else {
      setIsImgSizeOk(false);
      setPreview("");
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }
    const photoUrl = `https://imagedelivery.net/U3ZvfSHMWBX1DnDWzDMR4A/${photoId}`;
    formData.set("photo", photoUrl);
    return uploadProduct(_, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div className="p-5 flex flex-col gap-5">
      <h1 className="text-xl font-semibold">상품 추가하기</h1>
      <form action={action} className="flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="relative border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-center text-neutral-400 text-sm flex flex-col gap-1 mt-1">
                <div>Please add a photo</div>
                {/* server action photo error */}
                <div>{state?.fieldErrors.photo}</div>
                <div className="font-semibold text-[16px] flex flex-row gap-1">
                  <span>The maximum file size is</span>
                  <span className="text-orange-500">3MB</span>
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
          required
        />
        <Input
          name="title"
          required
          placeholder="Title"
          type="text"
          minLength={TITLE_MIN_LENGTH}
          maxLength={TITLE_MAX_LENGTH}
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="Price"
          min={PRICE_MIN}
          max={PRICE_MAX}
          errors={state?.fieldErrors.price}
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

        {isImgSizeOk ? (
          <Button text="Upload" />
        ) : (
          <button
            disabled={true}
            className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
          >
            Please check the file size
          </button>
        )}
      </form>
    </div>
  );
}
