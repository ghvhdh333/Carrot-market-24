import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { notFound } from "next/navigation";
import { getMyProducts } from "./actions";
import ProductSimpleInfo from "@/components/home-page/product-simple-info";
import { unstable_cache as nextCache } from "next/cache";
export const metadata = {
  title: "My Products",
};

// 유저 정보 가져옴
async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  // 세션id가 없는 경우 (= 잘못된 경로로 접속한 경우), 에러 페이지 보여줌
  notFound();
}

const getCacheProductList = nextCache(getMyProducts, ["my-product-list"], {
  tags: ["my-product-list"],
  revalidate: 60,
});

export default async function MyProducts() {
  const user = await getUser();
  const myProducts = await getCacheProductList(user.id);

  return (
    <div className="p-5 flex flex-col gap-5">
      <h1 className="font-semibold text-xl">내가 등록한 상품들</h1>
      {myProducts[0].products.map((product) => (
        <ProductSimpleInfo key={product.id} {...product} />
      ))}
    </div>
  );
}
