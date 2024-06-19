import EditBtn from "@/components/buttons/edit-btn";
import ProductDeleteBtn from "@/components/home-page/product-delete-btn";
import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { formatToWon } from "@/lib/utils";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// 쿠키에 있는 id가 제품을 업로드한 사용자의 id와 일치하는지 확인한다.
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      title: true,
    },
  });
  return product;
}

function getCachedProductTitle(productId: number) {
  const cachedOperation = nextCache(
    getProductTitle,
    [`product-title-${productId}`],
    {
      revalidate: 60,
      tags: [`product-title-${productId}`],
    }
  );
  return cachedOperation(productId);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
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

function getCachedProductDetail(productId: number) {
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
  const product = await getCachedProductDetail(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  // action.ts 로 옮기기!
  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  };

  return (
    <div className="pb-28 flex flex-col">
      <div className="my-2 flex flex-row">
        <Link
          href={"/home"}
          className="w-10 h-10 flex flex-row justify-center items-center bg-orange-400 rounded-full hover:bg-opacity-90"
        >
          <HomeIcon className="text-white w-8 h-8 " />
        </Link>
      </div>
      <div className="relative aspect-square">
        <Image
          className="object-cover rounded-lg"
          fill
          priority
          src={`${product.photo}/public`}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex flex-row justify-between border-b border-neutral-700">
        <div className="flex flex-row items-center gap-3">
          <div>
            {product.user.avatar !== null ? (
              <Image
                src={product.user.avatar}
                width={40}
                height={40}
                alt={product.user.username}
                className="rounded-full"
              />
            ) : (
              <UserIcon className="size-10 rounded-full" />
            )}
          </div>
          <div>
            <h3>{product.user.username}</h3>
          </div>
        </div>
        {isOwner ? (
          <div className="">
            <ProductDeleteBtn id={id} />
            <EditBtn link={`/edit/product/${id}`} />
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <h1 className="text-2xl font-semibold pb-3">{product.title}</h1>
        <p>{product.description}</p>
      </div>

      <div className="fixed w-full bottom-0 max-w-screen-sm p-5 bg-neutral-800 flex justify-between items-center rounded-lg">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)} 원
        </span>
        <form action={createChatRoom}>
          <button className="bg-orange-500 px-16 py-2.5 rounded-md text-white font-semibold hover:bg-opacity-90">
            <ChatBubbleOvalLeftEllipsisIcon className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
