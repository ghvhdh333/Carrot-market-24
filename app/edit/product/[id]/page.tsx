import EditProductForm from "@/components/edit-page/edit-product-form";
import getSession from "@/lib/session/getSession";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";
import { getProduct } from "./actions";

export const metadata = {
  title: "Edit | Product",
};

// 쿠키에 있는 id가 제품을 업로드한 사용자의 id와 일치하는지 확인한다.
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

function getCacheProductDetail(productId: number) {
  const cachedOperation = nextCache(
    getProduct,
    [`product-detail-${productId}`],
    {
      revalidate: 60,
      tags: [`product-detail-${productId}`],
    }
  );
  return cachedOperation(productId);
}

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);
  // 숫자 모양이 아니라면 NaN이 되므로 notFound가 뜬다.
  if (isNaN(productId)) {
    return notFound();
  }
  // session을 가져온다, 없으면 notFound
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }
  // post를 가져온다. 없으면 notFound
  const oldProduct = await getCacheProductDetail(productId);
  if (!oldProduct) {
    return notFound();
  }
  // 작성자인지 확인한다. 일치하지 않으면 notFound
  const isOwner = await getIsOwner(oldProduct.userId);
  if (!isOwner) {
    return notFound();
  }

  return (
    <div>
      <EditProductForm oldProduct={oldProduct} />
    </div>
  );
}
