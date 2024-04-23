import getSession from "./getSession";
import { redirect } from "next/navigation";

export default async function UpdateSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
  redirect("/profile");
}
