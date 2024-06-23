import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { notFound } from "next/navigation";
import EditUsernameForm from "@/components/edit-page/edit-username-form";

export const metadata = {
  title: "Edit | Username",
};

async function getUser(id: number) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  return user;
}

export default async function EditUsername() {
  // session을 가져온다, 없으면 notFound
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }
  // user를 가져온다. 없으면 notFound
  const user = await getUser(session.id);
  if (!user) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <EditUsernameForm />
    </div>
  );
}
