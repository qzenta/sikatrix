import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

// Public read-only endpoint: article slugs/titles/dates already live on the
// public blog, exposed as JSON so the n8n morning digest can diff against
// data/linkedin-posted.json without cloning the repo.
export async function GET() {
  const articles = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    publishDate: p.publishDate,
  }));
  return NextResponse.json({ articles });
}
