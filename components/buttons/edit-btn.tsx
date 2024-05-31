import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface EditBtnProps {
  link: string;
}

export default function EditBtn({ link }: EditBtnProps) {
  return (
    // <Link
    //   href={link}
    //   className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
    // >
    //   <PencilSquareIcon className="size-10" />
    // </Link>

    <Link
      href={link}
      className="bg-lime-600 px-10 py-2.5 rounded-md text-white font-semibold hover:bg-opacity-90"
    >
      <WrenchScrewdriverIcon className="size-5" />
    </Link>
  );
}
