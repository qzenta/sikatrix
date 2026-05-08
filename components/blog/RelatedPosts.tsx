import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog-config";

interface RelatedPostsProps {
  posts: PostMeta[];
  title?: string;
}

export default function RelatedPosts({
  posts,
  title = "Related articles",
}: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <div className="mt-10 pt-8 border-t border-neutral-200">
      <h3 className="text-sm font-semibold text-neutral-900 mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/resources/${post.slug}`}
            className="card p-4 group flex gap-3 items-start"
          >
            {post.featuredImage && (
              <div className="relative w-16 h-14 rounded-md overflow-hidden flex-shrink-0 bg-neutral-100">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-2xs font-semibold uppercase tracking-widest text-accent block mb-1">
                {post.category}
              </span>
              <h4 className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug mb-1.5">
                {post.title}
              </h4>
              <span className="inline-flex items-center gap-1 text-2xs text-neutral-400">
                <Clock size={9} />
                {post.readTime}
              </span>
            </div>
            <ArrowRight
              size={12}
              className="text-brand mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
