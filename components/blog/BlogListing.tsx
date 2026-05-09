"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import type { PostMeta } from "@/lib/blog-config";
import { BLOG_CATEGORIES } from "@/lib/blog-config";

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
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
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

      {/* Featured article */}
      {featured && (
        <Link
          href={`/resources/${featured.slug}`}
          className="card p-7 mb-8 flex flex-col sm:flex-row gap-6 group"
        >
          <div className="sm:w-2/3">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent">
                <Tag size={9} /> {featured.category}
              </span>
              <span className="text-neutral-200">·</span>
              <span className="text-2xs text-neutral-400 flex items-center gap-1">
                <Clock size={9} /> {featured.readTime}
              </span>
              <span className="text-2xs font-semibold text-brand bg-brand-50 px-2 py-0.5 rounded">
                Featured
              </span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 leading-snug mb-3 group-hover:text-brand transition-colors">
              {featured.title}
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
              {featured.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
              Read article <ArrowRight size={13} />
            </span>
          </div>
          <div className="sm:w-1/3 relative rounded-lg overflow-hidden min-h-32 bg-brand-50">
            {featured.featuredImage ? (
              <Image
                src={featured.featuredImage}
                alt={featured.featuredImageAlt || featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full min-h-32 h-full bg-gradient-to-br from-brand to-brand/70" />
            )}
          </div>
        </Link>
      )}

      {/* Article grid */}
      {rest.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/${post.slug}`}
              className="card overflow-hidden group"
            >
              <div className="relative h-36 bg-brand-50 overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand to-brand/70" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xs font-semibold uppercase tracking-widest text-accent">
                    {post.category}
                  </span>
                  <span className="text-neutral-200">·</span>
                  <span className="text-2xs text-neutral-400">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">
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
      ) : (
        !featured && (
          <p className="text-sm text-neutral-500 py-8 text-center">
            No articles in this category yet.
          </p>
        )
      )}
    </div>
  );
}
