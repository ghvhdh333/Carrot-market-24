import ProductList from "@/components/product-page/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import AddBtn from "@/components/buttons/add-btn";

export const metadata = {
  title: "home",
};

// 상품 리스트를 cache로 저장한다.
// getInitialProducts 함수가 60초 이내에 재호출 시 cache에 저장된 기존 데이터를 보여주고,
// getInitialProducts 함수가 60초 이후에 재호출 시 nextCache에 있는 함수(getInitialProducts)를 호출하여, 데이터를 갱신하고, 함수 호출 시 다시 revalidate 시간이 작동한다.
const getCacheProductList = nextCache(
  getInitialProductList,
  ["home-product-list"],
  {
    tags: ["home-product-list"],
    revalidate: 60,
  }
);

// export const dynamic = 'force-dynamic';
// export const revalidate = 60;

async function getInitialProductList() {
  // 처음으로 product 페이지 띄울 때
  const initialProductList = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 10, // take에 적힌 수 만큼 상품 리스트 가져옴
    orderBy: {
      created_at: "desc", // 최신 순으로 정렬함
    },
  });
  return initialProductList;
}
// getInitialProducts의 타입 입력 (interface로 해도 됌)
export type InitialProductList = Prisma.PromiseReturnType<
  typeof getInitialProductList
>;

export default async function Products() {
  const initialProductList = await getCacheProductList();
  return (
    <div>
      <ProductList initialProductList={initialProductList} />
      <AddBtn link="/add/products" />
    </div>
  );
}
