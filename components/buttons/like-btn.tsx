"use client";

import { HandThumbUpIcon as SolidHandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/post/[id]/action";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  // useOptimistic 실제 서버에서 적용된 데이터를 가져오는 것이 아니라, 바로 적용시켜서 보여주고,
  // 추후에 적용된 상태를 적용시켜 준다. (= 유저는 기다림 없이 바로 상태를 볼 수 있다.)
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  // 좋아요 버튼 누른 경우
  const onClickLikeBtn = async () => {
    reducerFn(undefined);

    if (isLiked) {
      // 좋아요 버튼이 눌려져 있는 상태에서 다시 누른 경우
      await dislikePost(postId);
    } else {
      // 좋아요 버튼이 눌려져 있지 않은 상태에서 누른 경우
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClickLikeBtn}
      type="button"
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-800"
      }`}
    >
      {state.isLiked ? (
        <SolidHandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span>좋아요 ({state.likeCount})</span>
      )}
    </button>
  );
}
