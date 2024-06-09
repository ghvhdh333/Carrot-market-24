import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterTextIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface PostSimpleInfoProps {
  id: number;
  title: string;
  description: string;
  views: number;
  created_at: Date;
  _count: {
    comments: number;
    likes: number;
  };
}

export default function PostSimpleInfo({
  id,
  title,
  description,
  views,
  created_at,
  _count: { comments, likes },
}: PostSimpleInfoProps) {
  return (
    <div className="border-b border-neutral-500 last:pb-0 last:border-b-0">
      <Link
        href={`/post/${id}`}
        className="py-3 text-neutral-400 flex flex-col gap-2 hover:bg-neutral-800 hover:rounded-lg"
      >
        <h2 className="text-white text-lg font-semibold">{title}</h2>
        {description!.length >= 30 ? (
          <p>{description!.slice(0, 30)} ...</p>
        ) : (
          <p>{description}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-2 items-center">
            <span>{formatToTimeAgo(created_at.toString())}</span>
            <span>·</span>
            <span>조회 {views}</span>
          </div>
          <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
            <span>
              <HandThumbUpIcon className="size-4" />
              {likes}
            </span>
            <span>
              <ChatBubbleBottomCenterTextIcon className="size-4" />
              {comments}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
