// Types and static config shared between server (lib/blog.ts) and client components.
// No 'fs' or Node.js-only imports allowed here.

export interface PostAuthor {
  name: string;
  title: string;
  image?: string;
}

export interface PostSocialMeta {
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  author: PostAuthor;
  publishDate: string;
  updatedDate?: string;
  readTime: string;
  featured: boolean;
  topicCluster: string;
  relatedServices: string[];
  relatedPosts: string[];
  social: PostSocialMeta;
  newsletterSegment?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export const BLOG_CATEGORIES = [
  "Tax",
  "SARS Compliance",
  "Bookkeeping",
  "Business Growth",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const TOPIC_CLUSTERS: Record<
  string,
  { label: string; description: string; color: string }
> = {
  sars: {
    label: "SARS",
    description: "SARS compliance, eFiling registrations, and submissions.",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  vat: {
    label: "VAT",
    description: "VAT registration, returns, input and output tax.",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  bookkeeping: {
    label: "Bookkeeping",
    description: "Record-keeping, reconciliations, and accounting best practices.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  payroll: {
    label: "Payroll",
    description: "PAYE, UIF, SDL, COIDA, and all employer statutory obligations.",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  tax: {
    label: "Tax",
    description: "Income tax, provisional tax, Capital Gains Tax, and SARS tax planning.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "business-growth": {
    label: "Business Growth",
    description: "Company registration, compliance, and growth strategies for South African SMEs.",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  sme: {
    label: "SMEs",
    description: "Business growth, compliance, and finance for small businesses.",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  "import-export": {
    label: "Import/Export",
    description: "SARS customs registration and international trade.",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  "business-permits": {
    label: "Business Permits",
    description: "Work permits, business visas, and CIPC support.",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  compliance: {
    label: "Compliance",
    description: "Tax and regulatory compliance for South African businesses.",
    color: "bg-neutral-50 text-neutral-700 border-neutral-200",
  },
};
