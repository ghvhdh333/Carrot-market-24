"use client";

import { useEffect, useRef, useState } from "react";
import { InitialPostList } from "@/app/(tabs)/life/page";
import { getMorePostList } from "@/app/(tabs)/life/actions";
import PostSimpleInfo from "./post-simple-info";

interface PostListProps {
  initialPostList: InitialPostList;
}

export default function PostList({ initialPostList }: PostListProps) {
  const [postList, setPostList] = useState(initialPostList);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        // 화면에 버튼이 보이면
        if (element.isIntersecting && trigger.current) {
          // 트리거를 관찰하지 않고,
          observer.unobserve(trigger.current);
          setIsLoading(true);
          // 새로운 상품 데이터를 가져온다.
          const newPostList = await getMorePostList(page + 1);
          // 마지막 상품 데이터가 아니라면 (= 더 가져올 상품 데이터가 있다면), 데이터를 추가시킨다.
          if (newPostList.length !== 0) {
            setPostList([...postList, ...newPostList]);
            // page의 값이 변경되므로, useEffect의 dependency로 인해 useEffect가 다시 실행된다.
            // 그로 인해 다시 해당 트리거를 관찰(observe)한다.
            setPage(page + 1);
          }

          // 마지막 상품 데이터라면 (= 더 가져올 상품 데이터가 없다면),
          else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0, // 해당 버튼이 전체(100%) 다보여야 동작한다. (0.5 === 50%)
      }
    );
    // trigger가 null(초기값)이 아니면, 관찰한다.
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    // 유저가 해당 페이지를 벗어난다면, 트리거를 더이상 관찰하지 않는다.
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col mb-20">
      {postList.map((post) => (
        <PostSimpleInfo key={post.id} {...post} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95 mt-5"
        >
          {isLoading ? "Loading..." : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
