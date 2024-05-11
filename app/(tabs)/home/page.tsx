import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

export const metadata = {
  title: "home",
};

// 상품 리스트를 cache로 저장한다.
// getInitialProducts 함수가 60초 이내에 재호출 시 cache에 저장된 기존 데이터를 보여주고,
// getInitialProducts 함수가 60초 이후에 재호출 시 nextCache에 있는 함수(getInitialProducts)를 호출하여, 데이터를 갱신하고, 함수 호출 시 다시 revalidate 시간이 작동한다.
const getCacheProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  // take에 적힌 수 만큼 상품 리스트 가져옴
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc", // 최신 순으로 정렬함
    },
  });
  return products;
}
// getInitialProducts의 타입 입력 (interface로 해도 됌)
export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

const revalidate = async () => {
  "use server";
  revalidatePath("/home");
};

export default async function Products() {
  const initialProducts = await getCacheProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>revalidate</button>
      </form>
      <Link
        href="/add/products"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
