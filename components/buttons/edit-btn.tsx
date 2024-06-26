import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface EditBtnProps {
  link: string;
}

export default function EditBtn({ link }: EditBtnProps) {
  return (
    <Link
      href={link}
      className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-40 right-8 text-white transition-colors hover:bg-orange-400"
    >
      <WrenchScrewdriverIcon className="size-10" />
    </Link>
  );
}
