import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Tag,
  BookOpen,
} from "lucide-react";
import { brand } from "../../safety/theme";
import LegalFooter from "../../safety/components/LegalFooter";
import { formatBlogDateLong, getPublicBlogBySlug } from "@/lib/blogs";
import CommentSection from "./CommentSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicBlogBySlug(slug);
  if (!data?.post) {
    return { title: `Blog Post | ${brand.name}` };
  }
  return {
    title: `${data.post.title} | ${brand.name} Blog`,
    description: data.post.summary || `Read ${data.post.title} on Vellora.`,
    openGraph: {
      title: data.post.title,
      description: data.post.summary,
      images: data.post.coverImage ? [data.post.coverImage] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPublicBlogBySlug(slug);

  if (!data || !data.post) {
    notFound();
  }

  const { post, comments } = data;

  // Split content into clean paragraphs
  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink flex flex-col justify-between">
      {/* Top Bar */}
      <header className="border-b border-brand-magenta/10 bg-white/70 backdrop-blur-md px-4 py-4 sm:px-6 sticky top-0 z-30">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 px-3.5 py-1.5 text-xs font-semibold text-brand-magenta transition-colors hover:bg-brand-magenta/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Articles</span>
          </Link>

          <Link href="/" className="font-display font-extrabold text-lg text-brand-ink">
            {brand.name}
          </Link>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 w-full flex-1">
        <article className="rounded-card bg-white p-6 sm:p-10 shadow-card">
          {/* Category & Read Time */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-pink/10 px-3 py-1 text-xs font-bold text-brand-pink">
              {post.category}
            </span>
            <span className="text-xs text-brand-ink-soft">•</span>
            <span className="flex items-center gap-1 text-xs font-medium text-brand-ink-soft">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime || "3 min read"}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-brand-ink">
            {post.title}
          </h1>

          {/* Author and Date Meta */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-brand-magenta/10 py-4 text-xs text-brand-ink-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-brand-pink to-brand-magenta font-bold text-white shadow-sm">
                {post.author ? post.author.charAt(0).toUpperCase() : "V"}
              </div>
              <div>
                <p className="font-bold text-brand-ink">{post.author || "Vellora Team"}</p>
                <p className="flex items-center gap-1" suppressHydrationWarning>
                  <Calendar className="h-3 w-3" />
                  {formatBlogDateLong(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-brand-ink-soft">
                <Eye className="h-3.5 w-3.5" />
                {post.views || 0} views
              </span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="my-8 overflow-hidden rounded-2xl shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          )}

          {/* Summary / Lead Paragraph */}
          {post.summary && (
            <div className="my-6 rounded-2xl bg-brand-bg/60 p-5 border-l-4 border-brand-magenta text-base sm:text-lg font-medium italic text-brand-ink leading-relaxed">
              &ldquo;{post.summary}&rdquo;
            </div>
          )}

          {/* Article Content */}
          <div className="mt-8 space-y-6 text-base sm:text-lg text-brand-ink leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-brand-magenta/10 pt-6">
              <span className="flex items-center gap-1 text-xs font-semibold text-brand-ink-soft">
                <Tag className="h-3.5 w-3.5" />
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-bg px-3 py-1 text-xs font-medium text-brand-ink-soft"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <CommentSection slug={post.slug} comments={comments || []} />
        </article>
      </main>

      <LegalFooter />
    </div>
  );
}
