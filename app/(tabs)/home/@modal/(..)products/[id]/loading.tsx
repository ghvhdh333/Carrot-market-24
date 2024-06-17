import { PhotoIcon } from "@heroicons/react/24/solid";

export default async function Loading() {
  return (
    <div className="absolute w-full h-full z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <div className="max-w-screen-sm flex flex-col justify-center w-2/3 bg-neutral-900 rounded-lg">
        <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div>
        <div className="animate-pulse p-5 flex flex-col gap-5 ">
          <div className="flex gap-2 items-center">
            <div className="size-14 rounded-full bg-neutral-700" />
            <div className="flex flex-col gap-1">
              <div className="h-8 w-40 bg-neutral-700 rounded-md" />
            </div>
          </div>
          <div className="border-b border-[1px] border-neutral-700" />
          <div className="flex flex-col gap-2">
            <div className="h-8 w-40 bg-neutral-700 rounded-md" />
            <div className="h-5 w-80 bg-neutral-700 rounded-md" />
            <div className="h-5 w-80 bg-neutral-700 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
