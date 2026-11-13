import type { Metadata } from "next";
import AdminPage from "../../_components/AdminPage";
import BlogManager from "./BlogManager";
import { api, apiList } from "@/lib/admin/api";
import { requireAdmin } from "@/lib/admin/session";
import type { AdminBlogPost, AdminBlogComment } from "@/lib/admin/types";

export const metadata: Metadata = { title: "Blog & Story Management" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function BlogsAdminPage({ searchParams }: Props) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const activeTab = sp?.tab === "comments" ? "comments" : "posts";

  // Fetch blogs
  const { items: blogs } = await apiList<AdminBlogPost>("/blogs", { limit: 100 });
  const blogList = Array.isArray(blogs) ? blogs : [];

  // Fetch comments
  let commentList: AdminBlogComment[] = [];
  let pendingCount = 0;
  try {
    const commentsRes = await api<AdminBlogComment[]>("/blogs-comments", {
      query: { limit: 100 },
    });
    commentList = Array.isArray(commentsRes.data) ? commentsRes.data : [];
    pendingCount = (commentsRes as { pendingCount?: number }).pendingCount ?? 0;
  } catch (err) {
    console.error("Failed to load comments", err);
  }

  return (
    <AdminPage
      admin={admin}
      heading="Blog &amp; Story CMS"
      subheading="Publish articles, dating advice, safety guides, and moderate reader comments"
    >
      <BlogManager
        initialTab={activeTab}
        blogs={blogList}
        comments={commentList}
        pendingCommentsCount={pendingCount}
      />
    </AdminPage>
  );
}
