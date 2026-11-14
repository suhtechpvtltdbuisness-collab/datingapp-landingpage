"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  MessageSquare,
  Plus,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  Sparkles,
  ShieldCheck,
  Tag,
  Calendar,
  X,
  AlertTriangle,
  UploadCloud,
  Camera,
  ImageIcon,
} from "lucide-react";
import SubmitButton from "../../_components/SubmitButton";
import { cx } from "../../_components/ui";
import {
  approveBlogComment,
  createBlogPost,
  deleteBlogComment,
  deleteBlogPost,
  rejectBlogComment,
  toggleBlogPost,
  updateBlogPost,
} from "../../actions";
import { formatBlogDate, blogImageSrc } from "@/lib/blogs";
import type { AdminBlogPost, AdminBlogComment } from "@/lib/admin/types";
import BlogContentEditor from "./BlogContentEditor";

interface Props {
  initialTab?: "posts" | "comments";
  blogs: AdminBlogPost[];
  comments: AdminBlogComment[];
  pendingCommentsCount: number;
}

const CATEGORIES = [
  "Dating Tips",
  "Safety & Privacy",
  "Relationships",
  "Real Talk",
  "Success Stories",
  "Product Updates",
];

export default function BlogManager({
  initialTab = "posts",
  blogs,
  comments,
  pendingCommentsCount,
}: Props) {
  const [tab, setTab] = useState<"posts" | "comments">(initialTab);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [commentFilter, setCommentFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");

  // Cover image upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string>("");

  const isModalOpen = isCreating || Boolean(editingPost);

  const openCreateModal = () => {
    setEditingPost(null);
    setCoverPreview(null);
    setExistingCoverUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsCreating(true);
  };

  const openEditModal = (post: AdminBlogPost) => {
    setEditingPost(post);
    setCoverPreview(blogImageSrc(post.coverImage) || null);
    setExistingCoverUrl(post.coverImage || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsCreating(false);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingPost(null);
    setCoverPreview(null);
    setExistingCoverUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setCoverPreview(null);
    setExistingCoverUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const filteredComments = comments.filter((c) => {
    if (commentFilter === "all") return true;
    return c.status === commentFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics & Navigation Tabs */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/5 p-4 sm:p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-pink-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Editorial &amp; Moderation Desk</span>
            </div>
            <h2 className="mt-1 text-[20px] font-bold tracking-tight text-admin-ink">
              Blog Content &amp; Reader Community
            </h2>
            <p className="mt-0.5 text-[13px] text-admin-ink-2">
              Create SEO articles for the Vellora web presence and moderate comments submitted by readers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-4 py-2 sm:px-5 sm:py-2.5 text-[12.5px] sm:text-[13px] font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Write New Article</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-pink-500/10 pt-4">
          <button
            type="button"
            onClick={() => setTab("posts")}
            className={cx(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
              tab === "posts"
                ? "bg-white text-admin-ink shadow-sm"
                : "text-admin-ink-2 hover:bg-white/40",
            )}
          >
            <BookOpen className="h-4 w-4 text-pink-500" />
            <span>Articles</span>
            <span className="rounded-full bg-pink-500/10 px-2 py-0.5 text-[11px] font-bold text-pink-600">
              {blogs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("comments")}
            className={cx(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
              tab === "comments"
                ? "bg-white text-admin-ink shadow-sm"
                : "text-admin-ink-2 hover:bg-white/40",
            )}
          >
            <MessageSquare className="h-4 w-4 text-purple-500" />
            <span>Comments Moderation</span>
            {pendingCommentsCount > 0 ? (
              <span className="animate-pulse rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                {pendingCommentsCount} Pending
              </span>
            ) : (
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600">
                {comments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: ARTICLES */}
      {tab === "posts" && (
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-gray-300 bg-white/60 p-12 text-center backdrop-blur-sm">
              <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-3 text-base font-semibold text-admin-ink">No articles created yet</h3>
              <p className="mt-1 text-sm text-admin-ink-2">
                Click &quot;Write New Article&quot; above to publish your first blog post.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col justify-between overflow-hidden rounded-[20px] border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
                >
                  <div>
                    {/* Cover image thumbnail if present */}
                    {post.coverImage ? (
                      <div className="relative mb-3.5 h-36 w-full overflow-hidden rounded-[14px] bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blogImageSrc(post.coverImage)}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                          {post.category}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3.5 flex items-center justify-between">
                        <span className="rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-pink-600">
                          {post.category}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[12px] text-admin-ink-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime || "3 min read"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.views || 0} views
                      </span>
                    </div>

                    <h3 className="mt-2 text-[16px] font-bold tracking-tight text-admin-ink line-clamp-2">
                      {post.title}
                    </h3>

                    {post.summary && (
                      <p className="mt-1.5 text-[13px] text-admin-ink-2 line-clamp-2">
                        {post.summary}
                      </p>
                    )}

                    {/* Comment counts */}
                    <div className="mt-3 flex items-center gap-2 text-[11.5px] font-medium text-admin-ink-2">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
                        {post.approvedCommentCount ?? 0} approved comments
                      </span>
                      {(post.pendingCommentCount ?? 0) > 0 && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
                          {post.pendingCommentCount} pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      {/* Toggle status */}
                      <form action={toggleBlogPost.bind(null, post.id)}>
                        <button
                          type="submit"
                          title={post.isPublished ? "Published (Click to unpublish)" : "Draft (Click to publish)"}
                          className={cx(
                            "cursor-pointer inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                            post.isPublished
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300",
                          )}
                        >
                          {post.isPublished ? (
                            <>
                              <Eye className="h-3 w-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" /> Draft
                            </>
                          )}
                        </button>
                      </form>

                      {/* Public Link */}
                      <Link
                        href={`/blogs/${post.slug}`}
                        target="_blank"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-admin-ink-2 hover:bg-gray-100 hover:text-admin-ink"
                        title="View Public Post"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(post)}
                        className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full text-admin-ink-2 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <form
                        action={deleteBlogPost.bind(null, post.id)}
                        onSubmit={(e) => {
                          if (!confirm(`Are you sure you want to delete "${post.title}"? This will also delete all comments on this post.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <button
                          type="submit"
                          className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full text-admin-ink-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMENTS MODERATION QUEUE */}
      {tab === "comments" && (
        <div className="space-y-4">
          {/* Moderation Disclaimer Notice */}
          <div className="rounded-[18px] border border-purple-500/20 bg-purple-500/5 p-4 text-[13px] text-purple-900">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-purple-950">
                  Comment Review Policy:
                </strong>{" "}
                Reader comments submitted on blog articles are automatically placed in &quot;Pending&quot; status. They will{" "}
                <span className="font-bold underline">never be displayed publicly</span> to readers until an administrator clicks <strong>Approve</strong>.
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "pending" as const, label: "Pending Review", badge: pendingCommentsCount },
              { id: "approved" as const, label: "Approved (Public)", badge: 0 },
              { id: "rejected" as const, label: "Rejected", badge: 0 },
              { id: "all" as const, label: "All Comments", badge: 0 },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCommentFilter(filter.id)}
                className={cx(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all",
                  commentFilter === filter.id
                    ? "bg-admin-ink text-white shadow-sm"
                    : "bg-white/80 text-admin-ink-2 hover:bg-white",
                )}
              >
                <span>{filter.label}</span>
                {filter.badge > 0 && (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {filter.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Comment Cards */}
          {filteredComments.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-gray-300 bg-white/60 p-12 text-center backdrop-blur-sm">
              <MessageSquare className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-3 text-base font-semibold text-admin-ink">
                No {commentFilter !== "all" ? commentFilter : ""} comments found
              </h3>
              <p className="mt-1 text-sm text-admin-ink-2">
                {commentFilter === "pending"
                  ? "Great job! All submitted comments have been reviewed."
                  : "Comments submitted by website readers will appear here for review."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-[20px] border border-white/80 bg-white/70 p-4 sm:p-5 shadow-sm backdrop-blur-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-[14px] text-admin-ink">
                          {comment.authorName}
                        </span>
                        <span className="text-[12.5px] text-admin-ink-2">
                          &lt;{comment.authorEmail}&gt;
                        </span>
                        <span className="text-[11px] text-gray-400">•</span>
                        <span className="text-[12px] text-admin-ink-2" suppressHydrationWarning>
                          {formatBlogDate(comment.createdAt)}
                        </span>
                      </div>

                      {/* Post referenced */}
                      <div className="mt-1 flex items-center gap-1.5 text-[12px] text-admin-ink-2">
                        <span>On article:</span>
                        {comment.postSlug ? (
                          <Link
                            href={`/blogs/${comment.postSlug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 font-semibold text-pink-600 hover:underline"
                          >
                            <span>{comment.postTitle || comment.postSlug}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="font-semibold text-gray-700">
                            {comment.postTitle || "Article"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {comment.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Pending Review
                        </span>
                      )}
                      {comment.status === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approved (Public)
                        </span>
                      )}
                      {comment.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-700">
                          <XCircle className="h-3.5 w-3.5" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="mt-3 rounded-[12px] bg-gray-50/80 p-3.5 text-[13.5px] text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
                    {comment.content}
                  </div>

                  {/* Moderation Actions */}
                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                    {comment.status !== "approved" && (
                      <form action={approveBlogComment.bind(null, comment.id)}>
                        <button
                          type="submit"
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors active:scale-95"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve &amp; Make Public</span>
                        </button>
                      </form>
                    )}

                    {comment.status !== "rejected" && (
                      <form action={rejectBlogComment.bind(null, comment.id)}>
                        <button
                          type="submit"
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-amber-600/10 px-3.5 py-1.5 text-[12px] font-semibold text-amber-700 hover:bg-amber-600/20 transition-colors active:scale-95"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </form>
                    )}

                    <form
                      action={deleteBlogComment.bind(null, comment.id)}
                      onSubmit={(e) => {
                        if (!confirm("Are you sure you want to permanently delete this comment?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <button
                        type="submit"
                        className="cursor-pointer inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL (RESPONSIVE & FIXED SCROLL CONTAINER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          {/* Frosted Backdrop: click outside to close */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Container: strictly fits viewport with internal scrolling */}
          <div className="relative z-10 flex flex-col w-full max-w-2xl sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] rounded-[24px] sm:rounded-[28px] border border-white/80 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* 1. STICKY TOP HEADER (Always Visible) */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6 sm:py-4.5 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF3D77] to-[#8B2FC9] text-white shadow-sm">
                  {editingPost ? <Edit3 className="h-4.5 w-4.5 sm:h-5 sm:w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[16px] sm:text-[18px] font-bold text-admin-ink truncate">
                    {editingPost ? "Edit Blog Article" : "Write New Article"}
                  </h3>
                  <p className="text-[11.5px] sm:text-[12px] text-admin-ink-2 truncate">
                    {editingPost
                      ? "Update article contents, cover photo and metadata"
                      : "Create and publish a new story on the Vellora blog"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors ml-2"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 2. FORM WITH SCROLLABLE BODY & STICKY FOOTER */}
            <form
              action={
                editingPost
                  ? updateBlogPost.bind(null, editingPost.id)
                  : createBlogPost
              }
              className="flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              {/* Scrollable Form Fields */}
              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-admin-ink">
                    Article Title <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingPost?.title ?? ""}
                    placeholder="e.g. 7 Safety Tips for Your First In-Person Date"
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>

                {/* COVER IMAGE UPLOAD (FILE PICKER WITH LIVE PREVIEW) */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-admin-ink mb-1.5">
                    Cover Image Photo
                  </label>
                  {/* Stores existing cover image if not changed */}
                  <input
                    type="hidden"
                    name="coverImage"
                    value={existingCoverUrl}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="coverImageFile"
                    id="coverImageFileInput"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {coverPreview ? (
                    <div className="relative overflow-hidden rounded-[16px] border border-pink-200 bg-pink-50/20 shadow-sm group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverPreview}
                        alt="Article Cover Preview"
                        className="w-full h-44 sm:h-52 object-cover transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <label
                          htmlFor="coverImageFileInput"
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-admin-ink shadow-md hover:bg-gray-100 transition"
                        >
                          <Camera className="h-3.5 w-3.5 text-pink-600" />
                          <span>Change Photo</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                        Selected Image
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="coverImageFileInput"
                      className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-gray-300 bg-gray-50/70 p-6 text-center hover:border-pink-500 hover:bg-pink-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 group-hover:scale-110 transition-transform shadow-xs">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <p className="mt-2.5 text-xs sm:text-sm font-semibold text-admin-ink">
                        <span className="text-pink-600 underline">Click to upload cover photo</span> or drag &amp; drop
                      </p>
                      <p className="mt-1 text-[11.5px] text-admin-ink-2">
                        Upload JPG, PNG, WebP or GIF from your computer (up to 10MB)
                      </p>
                    </label>
                  )}
                </div>

                {/* Category & Read Time */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-admin-ink">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={editingPost?.category ?? "Dating Tips"}
                      className="mt-1 w-full rounded-[14px] border border-gray-200 px-3 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-admin-ink">
                      Read Time
                    </label>
                    <input
                      type="text"
                      name="readTime"
                      defaultValue={editingPost?.readTime ?? "4 min read"}
                      placeholder="e.g. 4 min read"
                      className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>
                </div>

                {/* Author & Custom Slug */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-admin-ink">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      defaultValue={editingPost?.author ?? "Vellora Team"}
                      placeholder="e.g. Vellora Team"
                      className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-admin-ink">
                      URL Slug (Optional — auto from title)
                    </label>
                    <input
                      type="text"
                      name="slug"
                      defaultValue={editingPost?.slug ?? ""}
                      placeholder="e.g. 7-safety-tips-first-date"
                      className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-mono"
                    />
                  </div>
                </div>

                {/* Summary / Excerpt */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-admin-ink">
                    Short Excerpt / Summary
                  </label>
                  <textarea
                    name="summary"
                    rows={2}
                    defaultValue={editingPost?.summary ?? ""}
                    placeholder="A punchy intro that appears on blog cards and Google previews..."
                    className="mt-1 w-full rounded-[14px] border border-gray-200 p-3 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>

                {/* Content Body */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-admin-ink mb-1.5">
                    Article Content <span className="text-pink-500">*</span>
                  </label>
                  <BlogContentEditor
                    key={editingPost?.id ?? "new"}
                    defaultValue={editingPost?.content ?? ""}
                    name="content"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[12.5px] font-semibold text-admin-ink">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingPost?.tags?.join(", ") ?? ""}
                    placeholder="safety, first-date, advice, tips"
                    className="mt-1 w-full rounded-[14px] border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-admin-ink focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              {/* 3. STICKY FOOTER (Always Visible with Submit & Status) */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-50/90 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    defaultChecked={editingPost ? editingPost.isPublished : true}
                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-[12.5px] sm:text-[13px] font-medium text-admin-ink cursor-pointer select-none"
                  >
                    Publish immediately (public on website)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold text-admin-ink-2 hover:bg-gray-200/70 transition-colors"
                  >
                    Cancel
                  </button>
                  <SubmitButton
                    idleText={editingPost ? "Save Changes" : "Publish Article"}
                    loadingText={editingPost ? "Saving..." : "Publishing..."}
                    className="cursor-pointer rounded-full bg-gradient-to-r from-[#FF3D77] to-[#FF6FA5] px-5 sm:px-6 py-2 text-[13px] font-semibold text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
