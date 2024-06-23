import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { notFound } from "next/navigation";
import EditUsernameForm from "@/components/edit-page/edit-username-form";

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
  notFound();
}

export default async function EditUsername() {
  const user = await getUser();
  return (
    <div className="flex flex-col gap-5 p-5">
      <EditUsernameForm />
    </div>
  );
}
