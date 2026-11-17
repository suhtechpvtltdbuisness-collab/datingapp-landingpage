import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { brand } from "../safety/theme";
import LegalFooter from "../safety/components/LegalFooter";
import { formatBlogDate, getPublicBlogs, blogImageSrc } from "@/lib/blogs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `Blog & Dating Guides | ${brand.name}`,
  description: `Discover safety advice, relationship stories, and modern dating insights from the ${brand.name} team.`,
  path: "/blogs",
});

export const revalidate = 30; // ISR cache 30s

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>;
}

const CATEGORIES = [
  "All",
  "Dating Tips",
  "Safety & Privacy",
  "Relationships",
  "Real Talk",
  "Success Stories",
  "Product Updates",
];

export default async function BlogsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const currentCategory = sp?.category || "All";
  const searchQuery = sp?.search || "";

  const { items: blogs, total } = await getPublicBlogs({
    category: currentCategory,
    search: searchQuery,
    limit: 50,
  });

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink flex flex-col justify-between">
      {/* Header Banner */}
      <header className="relative overflow-hidden bg-gradient-to-b from-white/80 via-white/50 to-brand-bg pt-10 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Top navigation */}
          <div className="flex items-center justify-between pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-brand-magenta/30 bg-white/70 px-4 py-2 text-sm font-semibold text-brand-magenta shadow-sm transition-all hover:bg-brand-magenta/10"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span>Back to Safety Centre</span>
            </Link>

            <Link href="/" className="font-display font-extrabold text-xl text-brand-ink">
              {brand.name}
            </Link>
          </div>

          <div className="text-center max-w-2xl mx-auto mt-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-3.5 py-1 text-xs font-semibold text-brand-pink mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Vellora Editorial &amp; Stories</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
              Stories, Safety &amp; Modern Dating
            </h1>
            <p className="mt-4 text-base sm:text-lg text-brand-ink-soft leading-relaxed">
              Actionable advice on meeting new people, protecting your privacy, and building meaningful connections.
            </p>
          </div>

          {/* Search bar & Filter Pills */}
          <div className="mt-10 max-w-2xl mx-auto space-y-4">
            <form action="/blogs" method="GET" className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search articles, safety tips, or guides..."
                className="w-full rounded-full border border-brand-magenta/20 bg-white py-3.5 pl-12 pr-28 text-sm text-brand-ink shadow-sm placeholder:text-gray-400 focus:border-brand-magenta focus:outline-none focus:ring-2 focus:ring-brand-magenta/20"
              />
              {currentCategory !== "All" && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              <button
                type="submit"
                className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-pink to-brand-magenta px-5 py-2 text-xs font-bold text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                Search
              </button>
            </form>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {CATEGORIES.map((cat) => {
                const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
                const href =
                  cat === "All"
                    ? searchQuery
                      ? `/blogs?search=${encodeURIComponent(searchQuery)}`
                      : "/blogs"
                    : searchQuery
                    ? `/blogs?category=${encodeURIComponent(cat)}&search=${encodeURIComponent(searchQuery)}`
                    : `/blogs?category=${encodeURIComponent(cat)}`;

                return (
                  <Link
                    key={cat}
                    href={href}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-brand-ink text-white shadow-sm"
                        : "bg-white/80 text-brand-ink-soft hover:bg-white hover:text-brand-ink shadow-sm"
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Blog List */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 w-full flex-1">
        {blogs.length === 0 ? (
          <div className="rounded-card bg-white p-12 text-center shadow-card max-w-lg mx-auto mt-6">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 font-display text-xl font-bold text-brand-ink">
              No articles found
            </h3>
            <p className="mt-2 text-sm text-brand-ink-soft">
              {searchQuery
                ? `No articles matched your search "${searchQuery}". Try a different keyword.`
                : "New articles and dating guides are coming soon. Check back shortly!"}
            </p>
            {(searchQuery || currentCategory !== "All") && (
              <div className="mt-6">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-pink/10 px-4 py-2 text-xs font-bold text-brand-pink hover:bg-brand-pink/20"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between overflow-hidden rounded-card bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
              >
                <div>
                  {/* Article cover image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-pink/10">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blogImageSrc(post.coverImage)}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50">
                        <BookOpen className="h-10 w-10 text-brand-magenta/40" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-brand-ink-soft">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime || "3 min read"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1" suppressHydrationWarning>
                        <Calendar className="h-3.5 w-3.5" />
                        {formatBlogDate(post.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-brand-ink group-hover:text-brand-magenta transition-colors line-clamp-2">
                      <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    {post.summary && (
                      <p className="mt-2 text-sm text-brand-ink-soft line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer of card */}
                <div className="flex items-center justify-between border-t border-brand-magenta/10 px-5 sm:px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-ink-soft">
                    <MessageSquare className="h-3.5 w-3.5 text-brand-magenta" />
                    <span>
                      {post.commentsCount}{" "}
                      {post.commentsCount === 1 ? "comment" : "comments"}
                    </span>
                  </div>

                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-magenta hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <LegalFooter />
    </div>
  );
}
