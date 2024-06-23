import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { notFound } from "next/navigation";
import EditPasswordForm from "@/components/edit-page/edit-password-form";

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

export default async function EditPassword() {
  const user = await getUser();
  return (
    <div className="flex flex-col gap-5 p-5">
      <EditPasswordForm />
    </div>
  );
}
