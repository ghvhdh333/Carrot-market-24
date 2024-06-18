"use client";

import { onClickDeleteUser } from "@/app/(tabs)/profile/actions";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface userDeleteBtnProps {
  id: number;
}

// id === user.id
export default function UserDeleteBtn({ id }: userDeleteBtnProps) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const onUserDelete = async () => {
    const confirm = window.confirm("정말로 회원 탈퇴 하시겠습니까?");
    if (!confirm) return;
    setLoading(true);
    await onClickDeleteUser(id);
    setLoading(false);
    router.push("/");
  };

  return (
    <section className="flex flex-row justify-center text-sm">
      {isLoading ? (
        <button
          className="text-gray-300 hover:text-white hover:underline underline-offset-4 flex flex-row gap-2 items-center "
          disabled
        >
          <ArrowPathIcon className="size-5 animate-spin" />
          진행 중...
        </button>
      ) : (
        <button
          onClick={onUserDelete}
          className=" text-gray-300 hover:text-white hover:underline underline-offset-4 "
        >
          회원 탈퇴하기
        </button>
      )}
    </section>
  );
}
