"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Tag, Sparkles, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import type { PostMeta } from "@/lib/blog-config";
import { BLOG_CATEGORIES } from "@/lib/blog-config";

const NEW_THRESHOLD_DAYS = 60;
const POSTS_PER_PAGE = 6;

function isNew(publishDate: string) {
  const pub = new Date(publishDate).getTime();
  const now = Date.now();
  return (now - pub) / (1000 * 60 * 60 * 24) <= NEW_THRESHOLD_DAYS;
}

function CategoryBadge({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-widest border border-accent/30 bg-accent/10 text-accent rounded ${
        small ? "text-[9px] px-1.5 py-0.5" : "text-2xs px-2 py-1"
      }`}
    >
      {label}
    </span>
  );
}

interface BlogListingProps {
  posts: PostMeta[];
}

export default function BlogListing({ posts }: BlogListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Reset to page 1 when category changes
  const [page, setPage] = useState(currentPage);
  useEffect(() => { setPage(currentPage); }, [currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    router.push("/resources", { scroll: false });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) params.delete("page");
    else params.set("page", String(p));
    router.push(`/resources?${params.toString()}`, { scroll: true });
  };

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);

  const allSortedByDate = [...posts]
    .filter((p) => !p.featured)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  const latestPost = activeCategory === "All" ? allSortedByDate[0] : null;

  const rest = filtered.filter(
    (p) => !p.featured && (!latestPost || activeCategory !== "All" || p.slug !== latestPost.slug)
  );

  const allByDate = [...posts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // Paginate the archive grid
  const totalPages = Math.ceil(rest.length / POSTS_PER_PAGE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const pagedRest = rest.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  return (
    <div>
      {/* ── Category filter ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-8 p-3 rounded-xl bg-white border border-neutral-200 shadow-sm">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
            activeCategory === "All"
              ? "bg-brand border-brand text-white shadow-sm"
              : "bg-neutral-50 border-neutral-300 text-neutral-700 hover:border-brand hover:text-brand hover:bg-brand/5 shadow-[inset_0_0_0_1px_theme(colors.neutral.200)]"
          }`}
        >
          All
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
              activeCategory === cat
                ? "bg-brand border-brand text-white shadow-sm"
                : "bg-neutral-50 border-neutral-300 text-neutral-700 hover:border-brand hover:text-brand hover:bg-brand/5 shadow-[inset_0_0_0_1px_theme(colors.neutral.200)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── 2-column: highlights + sidebar ──────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_240px] gap-6 items-start mb-6">

        <div className="min-w-0 space-y-4">

          {/* Latest post — only on page 1 */}
          {latestPost && safePage === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-accent" />
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full shadow-sm">
                  Latest News
                </span>
              </div>
              <Link
                href={`/resources/${latestPost.slug}`}
                className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-2xl border-2 border-neutral-300 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand/50 transition-all duration-300 group"
              >
                <div className="relative sm:w-52 h-44 sm:h-auto flex-shrink-0 bg-brand/10 overflow-hidden">
                  {latestPost.featuredImage ? (
                    <Image
                      src={latestPost.featuredImage}
                      alt={latestPost.featuredImageAlt || latestPost.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 208px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand to-brand/70" />
                  )}
                </div>
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white bg-accent px-2 py-0.5 rounded-full">
                      New
                    </span>
                    <CategoryBadge label={latestPost.category} small />
                    <span className="text-neutral-300">·</span>
                    <span className="text-2xs text-neutral-400 flex items-center gap-1">
                      <Clock size={9} /> {latestPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors">
                    {latestPost.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-3 line-clamp-2">
                    {latestPost.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xs text-neutral-400 flex items-center gap-1">
                      <Calendar size={9} />
                      {new Date(latestPost.publishDate).toLocaleDateString("en-ZA", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
                      Read article <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Featured article — only on page 1 */}
          {featured && safePage === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} className="text-brand" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brand">Featured Article</span>
              </div>
              <Link
                href={`/resources/${featured.slug}`}
                className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-2xl border-2 border-neutral-300 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand/50 transition-all duration-300 group"
              >
                <div className="relative sm:w-52 h-44 sm:h-auto flex-shrink-0 bg-brand/10 overflow-hidden">
                  {featured.featuredImage ? (
                    <Image
                      src={featured.featuredImage}
                      alt={featured.featuredImageAlt || featured.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 208px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand to-brand/70" />
                  )}
                </div>
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2.5">
                    <CategoryBadge label={featured.category} small />
                    <span className="text-neutral-300">·</span>
                    <span className="text-2xs text-neutral-400 flex items-center gap-1">
                      <Clock size={9} /> {featured.readTime}
                    </span>
                    <span className="text-2xs font-semibold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-3 line-clamp-2">
                    {featured.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
                    Read article <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          )}

          {!latestPost && !featured && (
            <p className="text-sm text-neutral-500 py-8 text-center">
              No articles in this category yet.
            </p>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border-2 border-neutral-300 bg-white overflow-hidden">
            <div className="bg-brand px-5 py-4">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-accent-light" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent-light">
                  All Articles
                </span>
              </div>
            </div>
            <div className="divide-y divide-neutral-100 max-h-[360px] overflow-y-auto">
              {allByDate.map((post) => (
                <Link
                  key={post.slug}
                  href={`/resources/${post.slug}`}
                  className="flex items-start gap-2 px-3 py-2.5 hover:bg-neutral-50 transition-colors group"
                >
                  <ChevronRight size={12} className="text-neutral-300 group-hover:text-brand mt-0.5 flex-shrink-0 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-700 group-hover:text-brand transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </p>
                    <CategoryBadge label={post.category} small />
                  </div>
                  {isNew(post.publishDate) && (
                    <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wide bg-accent text-white px-1.5 py-0.5 rounded-full mt-0.5">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
              <p className="text-[10px] text-neutral-400 text-center">
                {allByDate.length} articles · updated regularly
              </p>
            </div>
          </div>
        </aside>

      </div>

      {/* ── Archive grid ─────────────────────────────────────────────── */}
      {pagedRest.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-neutral-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              {totalPages > 1 ? `More Articles — Page ${safePage} of ${totalPages}` : "More Articles"}
            </span>
            <div className="h-px flex-1 bg-neutral-300" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagedRest.map((post) => (
              <Link
                key={post.slug}
                href={`/resources/${post.slug}`}
                className="rounded-xl border-2 border-neutral-300 bg-white overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 hover:border-brand/50 transition-all duration-300"
              >
                <div className="relative h-36 bg-brand/10 overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand to-brand/70" />
                  )}
                  {isNew(post.publishDate) && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest bg-accent text-white px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <CategoryBadge label={post.category} small />
                    <span className="text-neutral-300">·</span>
                    <span className="text-2xs text-neutral-400">{post.readTime}</span>
                  </div>
                  <h2 className="text-sm font-semibold text-neutral-800 leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-3 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xs text-neutral-400 flex items-center gap-1">
                      <Calendar size={9} />
                      {new Date(post.publishDate).toLocaleDateString("en-ZA", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-brand flex items-center gap-1 translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
                      Read <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Pagination ────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              <button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-neutral-300 bg-white text-neutral-700 hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={13} /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold border-2 transition-all ${
                    p === safePage
                      ? "bg-brand border-brand text-white shadow-sm"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-brand hover:text-brand"
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={p === safePage ? "page" : undefined}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-neutral-300 bg-white text-neutral-700 hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
