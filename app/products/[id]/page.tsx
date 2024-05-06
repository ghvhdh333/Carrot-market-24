import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// 쿠키에 있는 id가 제품을 업로드한 사용자의 id와 일치하는지 확인한다.
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

// 상품 정보와 등록한 유저의 정보를 가져온다.
async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  // url에 있는 id값을 가져온다.
  // params.id가 숫자면 숫자를 얻을 것이고, 문자면 NaN을 얻는다.
  // NaN인 경우에 에러페이지로 이동한다.
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  // DB에 해당 id값의 데이터가 있으면 가져오고,
  // 없으면 에러페이지로 이동한다.
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  return (
    <div className="pb-28">
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={product.photo}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
              className="rounded-full"
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 max-w-screen-sm p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)} 원
        </span>
        {isOwner ? (
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
            Delete product
          </button>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          Chatting
        </Link>
      </div>
    </div>
  );
}
