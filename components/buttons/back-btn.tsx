import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface BackBtnProps {
  link: string;
}

export default function BackBtn({ link }: BackBtnProps) {
  return (
    <Link
      href={link}
      className="w-10 h-10 flex flex-row justify-center items-center bg-orange-400 rounded-full bg-opacity-90"
    >
      <ArrowLeftIcon className="text-white w-8 h-8 " />
    </Link>
  );
}
