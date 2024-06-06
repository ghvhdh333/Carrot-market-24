"use server";

import getSession from "@/lib/session/getSession";
import { redirect } from "next/navigation";

export async function logOut() {
  "use server";
  const session = await getSession();
  await session.destroy();
  redirect("/");
}
