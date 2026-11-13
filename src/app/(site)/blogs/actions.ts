"use server";

import { postBlogComment } from "@/lib/blogs";

export async function submitCommentAction(
  slug: string,
  data: { authorName: string; authorEmail: string; content: string },
) {
  return postBlogComment(slug, data);
}
