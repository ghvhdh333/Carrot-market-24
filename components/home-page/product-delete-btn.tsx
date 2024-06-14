"use client";

import { onClickDeleteProduct } from "@/app/products/[id]/actions";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductDeleteBtnProps {
  id: number;
}

export default function ProductDeleteBtn({ id }: ProductDeleteBtnProps) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    const confirm = window.confirm("상품을 삭제하시겠습니까?");
    if (!confirm) return;
    setLoading(true);
    await onClickDeleteProduct(id);
    setLoading(false);
    router.push("/home");
  };

  return (
    <div>
      {isLoading ? (
        <button
          disabled
          type="button"
          className="bg-neutral-500 flex items-center justify-center rounded-full size-12 fixed bottom-24 right-10 text-white transition-colors hover:pointer-events-none"
        >
          <ArrowPathIcon className="size-5 animate-spin" />
        </button>
      ) : (
        <button
          onClick={onDelete}
          type="button"
          className="bg-red-500 flex items-center justify-center rounded-full size-12 fixed bottom-24 right-10 text-white transition-colors hover:bg-opacity-90"
        >
          <TrashIcon className="size-8" />
        </button>
      )}
    </div>
  );
}
