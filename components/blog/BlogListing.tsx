"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Tag, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import type { PostMeta } from "@/lib/blog-config";
import { BLOG_CATEGORIES } from "@/lib/blog-config";

const NEW_THRESHOLD_DAYS = 60;

function isNew(publishDate: string) {
  const pub = new Date(publishDate).getTime();
  const now = Date.now();
  return (now - pub) / (1000 * 60 * 60 * 24) <= NEW_THRESHOLD_DAYS;
}

interface BlogListingProps {
  posts: PostMeta[];
}

export default function BlogListing({ posts }: BlogListingProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);

  // Latest post: most recently published non-featured post across ALL posts (not filtered)
  const allSortedByDate = [...posts]
    .filter((p) => !p.featured)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  const latestPost = activeCategory === "All" ? allSortedByDate[0] : null;

  // Exclude the latest post from the grid when on "All" to avoid duplication
  const rest = filtered.filter(
    (p) => !p.featured && (!latestPost || activeCategory !== "All" || p.slug !== latestPost.slug)
  );

  // All posts sorted by date for sidebar list
  const allByDate = [...posts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeCategory === "All"
              ? "bg-brand text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          All
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-brand text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Outer 2-column layout: main content left, sticky sidebar right */}
      <div className="grid lg:grid-cols-[1fr_268px] gap-8 items-start">

        {/* LEFT — all main content stacked */}
        <div className="min-w-0 space-y-6">

          {/* Latest post */}
          {latestPost && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-accent" />
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full shadow-sm">
                  Latest News
                </span>
              </div>
              <Link
                href={`/resources/${latestPost.slug}`}
                className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative sm:w-52 h-44 sm:h-auto flex-shrink-0 bg-brand/10">
                  {latestPost.featuredImage ? (
                    <Image
                      src={latestPost.featuredImage}
                      alt={latestPost.featuredImageAlt || latestPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 208px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand to-brand/70" />
                  )}
                </div>
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white bg-accent px-2 py-0.5 rounded-full">
                      New
                    </span>
                    <span className="text-2xs font-semibold uppercase tracking-widest text-accent">{latestPost.category}</span>
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
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                      Read article <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Featured article */}
          {featured && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} className="text-brand" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brand">Featured Article</span>
              </div>
              <Link
                href={`/resources/${featured.slug}`}
                className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative sm:w-52 h-44 sm:h-auto flex-shrink-0 bg-brand/10">
                  {featured.featuredImage ? (
                    <Image
                      src={featured.featuredImage}
                      alt={featured.featuredImageAlt || featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 208px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand to-brand/70" />
                  )}
                </div>
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent">
                      <Tag size={9} /> {featured.category}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-2xs text-neutral-400 flex items-center gap-1">
                      <Clock size={9} /> {featured.readTime}
                    </span>
                    <span className="text-2xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">
                    {featured.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                    Read article <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Archive grid */}
          {rest.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4 pt-2">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">More Articles</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/resources/${post.slug}`}
                    className="rounded-xl border border-neutral-200 bg-white overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-36 bg-brand/10 overflow-hidden">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.featuredImageAlt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xs font-semibold uppercase tracking-widest text-accent">
                          {post.category}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-2xs text-neutral-400">
                          {post.readTime}
                        </span>
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
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-brand flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!latestPost && !featured && rest.length === 0 && (
            <p className="text-sm text-neutral-500 py-8 text-center">
              No articles in this category yet.
            </p>
          )}
        </div>

        {/* RIGHT — sticky sidebar, spans all left content */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="bg-brand px-5 py-4">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-accent-light" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent-light">
                  All Articles
                </span>
              </div>
            </div>
            <div className="divide-y divide-neutral-100 max-h-[70vh] overflow-y-auto">
              {allByDate.map((post) => (
                <Link
                  key={post.slug}
                  href={`/resources/${post.slug}`}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors group"
                >
                  <ChevronRight size={12} className="text-neutral-300 group-hover:text-brand mt-0.5 flex-shrink-0 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-700 group-hover:text-brand transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </p>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">{post.category}</span>
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
    </div>
  );
}
