// "use client";
import { TrashIcon } from "@heroicons/react/24/outline";

const onClickRefreshButton = () => {};

export default function ProductDeleteBtn({ id }) {
  return (
    <button
      type="button"
      className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-opacity-90"
    >
      <TrashIcon className="size-5" />
    </button>
  );
}
