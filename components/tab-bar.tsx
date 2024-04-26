"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  VideoCameraIcon as SolidVideoCameraIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineVideoCameraIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 bg-neutral-900 border-t px-5 py-3 *:text-white">
      <Link href="/products" className="flex flex-col items-center gap-px">
        {pathname === "/products" ? (
          <SolidHomeIcon className="text-orange-400 w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span
          className={`${pathname === "/products" ? "text-orange-400" : ""}`}
        >
          Home
        </span>
      </Link>
      <Link href="/life" className="flex flex-col items-center gap-px">
        {pathname === "/life" ? (
          <SolidNewspaperIcon className="text-orange-400 w-7 h-7" />
        ) : (
          <OutlineNewspaperIcon className="w-7 h-7" />
        )}
        <span className={`${pathname === "/life" ? "text-orange-400" : ""}`}>
          Life
        </span>
      </Link>
      <Link href="/chat" className="flex flex-col items-center gap-px">
        {pathname === "/chat" ? (
          <SolidChatIcon className="text-orange-400 w-7 h-7" />
        ) : (
          <OutlineChatIcon className="w-7 h-7" />
        )}
        <span className={`${pathname === "/chat" ? "text-orange-400" : ""}`}>
          Chat
        </span>
      </Link>
      <Link href="/live" className="flex flex-col items-center gap-px">
        {pathname === "/live" ? (
          <SolidVideoCameraIcon className="text-orange-400 w-7 h-7" />
        ) : (
          <OutlineVideoCameraIcon className="w-7 h-7" />
        )}
        <span className={`${pathname === "/live" ? "text-orange-400" : ""}`}>
          Live
        </span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === "/profile" ? (
          <SolidUserIcon className="text-orange-400 w-7 h-7" />
        ) : (
          <OutlineUserIcon className="w-7 h-7" />
        )}
        <span className={`${pathname === "/profile" ? "text-orange-400" : ""}`}>
          My Carrot
        </span>
      </Link>
    </div>
  );
}
