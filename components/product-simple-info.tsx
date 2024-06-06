import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductSimpleInfoProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ProductSimpleInfo({
  title,
  price,
  created_at,
  photo,
  id,
}: ProductSimpleInfoProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex gap-5 hover:bg-neutral-800 rounded-lg"
    >
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          fill
          priority
          src={`${photo}/avatar`}
          alt={title}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between py-2">
        <div className="flex flex-col gap-1">
          <span className="text-lg text-white">{title}</span>
          <span className="text-sm text-neutral-400">
            {formatToTimeAgo(created_at.toString())}
          </span>
        </div>
        <span className="text-lg font-semibold text-white">
          {formatToWon(price)} 원
        </span>
      </div>
    </Link>
  );
}
