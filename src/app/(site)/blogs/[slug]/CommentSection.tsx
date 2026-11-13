"use client";

import { useState } from "react";
import {
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";
import { formatBlogDate, type PublicBlogComment } from "@/lib/blogs";
import { submitCommentAction } from "../actions";

interface Props {
  slug: string;
  comments: PublicBlogComment[];
}

export default function CommentSection({ slug, comments }: Props) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please fill in your name, email, and comment message.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await submitCommentAction(slug, {
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        content: content.trim(),
      });

      if (res.success) {
        setStatusMessage({
          type: "success",
          text:
            res.message ||
            "Thank you! Your comment has been submitted and will appear once approved by our team.",
        });
        setAuthorName("");
        setAuthorEmail("");
        setContent("");
      } else {
        setStatusMessage({
          type: "error",
          text: res.message || "Failed to submit comment. Please try again.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-14 border-t border-brand-magenta/15 pt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-brand-magenta" />
          <h3 className="font-display text-2xl font-bold text-brand-ink">
            Reader Discussion ({comments.length})
          </h3>
        </div>
      </div>

      {/* Moderation notice */}
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-brand-pink/5 border border-brand-pink/15 px-4 py-2.5 text-xs text-brand-ink-soft">
        <ShieldCheck className="h-4 w-4 text-brand-pink shrink-0" />
        <span>
          To maintain a respectful community, all reader comments are reviewed before appearing publicly.
        </span>
      </div>

      {/* Comment submission form */}
      <div className="mt-6 rounded-card bg-brand-bg/60 p-6 sm:p-8 border border-brand-magenta/10">
        <h4 className="font-display text-lg font-bold text-brand-ink">
          Leave a Comment
        </h4>
        <p className="mt-1 text-xs sm:text-sm text-brand-ink-soft">
          Your email address will remain strictly confidential and will never be published.
        </p>

        {statusMessage && (
          <div
            className={`mt-4 rounded-xl p-3.5 text-xs sm:text-sm flex items-start gap-2.5 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-brand-ink">
                Your Name <span className="text-brand-pink">*</span>
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="mt-1 w-full rounded-xl border border-brand-magenta/20 bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-gray-400 focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-ink">
                Email Address <span className="text-brand-pink">*</span>
              </label>
              <input
                type="email"
                required
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="priya@example.com"
                className="mt-1 w-full rounded-xl border border-brand-magenta/20 bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-gray-400 focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink">
              Your Comment <span className="text-brand-pink">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your perspective or feedback..."
              className="mt-1 w-full rounded-xl border border-brand-magenta/20 bg-white p-3.5 text-sm text-brand-ink placeholder:text-gray-400 focus:border-brand-magenta focus:outline-none focus:ring-1 focus:ring-brand-magenta"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-pink to-brand-magenta px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Comment"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Approved Comments List */}
      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-magenta/20 bg-white/50 p-8 text-center">
            <p className="text-sm font-semibold text-brand-ink">
              No approved comments yet.
            </p>
            <p className="mt-1 text-xs text-brand-ink-soft">
              Be the first to share your thoughts on this story!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-brand-magenta/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-pink/15 font-bold text-xs text-brand-magenta">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-brand-ink">
                      {comment.authorName}
                    </h5>
                    <div className="flex items-center gap-1 text-[11px] text-brand-ink-soft">
                      <Clock className="h-3 w-3" />
                      <span suppressHydrationWarning>
                        {formatBlogDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 text-sm text-brand-ink leading-relaxed break-words whitespace-pre-wrap">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
