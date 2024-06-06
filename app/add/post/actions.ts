"use server";

import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { redirect } from "next/navigation";
import {
  TITLE_REQUIRED_ERROR,
  TITLE_INVALID_TYPE_ERROR,
  TITLE_MIN_LENGTH,
  TITLE_MIN_LENGTH_ERROR,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_ERROR,
  DESCRIPTION_REQUIRED_ERROR,
  DESCRIPTION_INVALID_TYPE_ERROR,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MIN_LENGTH_ERROR,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH_ERROR,
} from "@/lib/constants";

const postSchema = z.object({
  title: z
    .string({
      required_error: TITLE_REQUIRED_ERROR,
      invalid_type_error: TITLE_INVALID_TYPE_ERROR,
    })
    .min(TITLE_MIN_LENGTH, TITLE_MIN_LENGTH_ERROR)
    .max(TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_ERROR),
  description: z
    .string({
      required_error: DESCRIPTION_REQUIRED_ERROR,
      invalid_type_error: DESCRIPTION_INVALID_TYPE_ERROR,
    })
    .min(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MIN_LENGTH_ERROR)
    .max(DESCRIPTION_MAX_LENGTH, DESCRIPTION_MAX_LENGTH_ERROR),
});

export async function uploadPost(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = postSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const post = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/post/${post.id}`);
    }
  }
}
