"use client";

import db from "@/lib/db";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ProductDeleteBtnProps {
  id: number;
}

// delete 버튼 기능 작성하기!
const onClickRefreshButton = () => {
  // db.product.delete({ select });
};

export default function ProductDeleteBtn({ id }: ProductDeleteBtnProps) {
  return (
    <button
      onClick={onClickRefreshButton}
      type="button"
      className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-opacity-90"
    >
      <TrashIcon className="size-5" />
    </button>
  );
}
