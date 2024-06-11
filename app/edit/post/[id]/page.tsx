import { notFound } from "next/navigation";
import getSession from "@/lib/session/getSession";
import { getPostDetail } from "./actions";
import PostEditForm from "@/components/life-page/post-edit-form";
import { unstable_cache as nextCache } from "next/cache";

// 쿠키에 있는 id가 제품을 업로드한 사용자의 id와 일치하는지 확인한다.
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

const getCachePostDetail = nextCache(getPostDetail, ["post-detail"], {
  tags: ["post-detail"],
});

export default async function EditPost({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  // 숫자 모양이 아니라면 NaN이 되므로 notFound가 뜬다.
  if (isNaN(id)) {
    return notFound();
  }
  // session을 가져온다, 없으면 notFound
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }
  // post를 가져온다. 없으면 notFound
  const post = await getCachePostDetail(id);
  if (!post) {
    return notFound();
  }
  // 작성자인지 확인한다. 일치하지 않으면 notFound
  const isOwner = await getIsOwner(post.userId);
  if (!isOwner) {
    return notFound();
  }

  return (
    <div>
      <PostEditForm postId={id} />
    </div>
  );
}
