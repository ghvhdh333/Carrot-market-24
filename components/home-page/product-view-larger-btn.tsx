"use client";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline";

const onClickRefreshButton = () => {
  window.location.reload();
};

export default function ProductViewLargerBtn() {
  return (
    <button
      type="button"
      onClick={onClickRefreshButton}
      className="bg-indigo-500 px-10 py-2.5 rounded-md text-white font-semibold hover:bg-opacity-90"
    >
      <MagnifyingGlassPlusIcon className="size-5" />
    </button>
  );
}
