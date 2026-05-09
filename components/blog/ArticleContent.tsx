import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface ArticleContentProps {
  content: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Parse inline markdown: **bold**, [text](url)
function parseInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  // Regex: match **bold** or [text](url)
  const regex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      parts.push(<strong key={key++} className="text-neutral-900 font-semibold">{match[1]}</strong>);
    } else if (match[2] !== undefined && match[3] !== undefined) {
      const isExternal = match[3].startsWith("http");
      parts.push(
        isExternal ? (
          <a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer"
            className="text-brand underline underline-offset-2 hover:text-brand-dark transition-colors">
            {match[2]}
          </a>
        ) : (
          <Link key={key++} href={match[3]} className="text-brand underline underline-offset-2 hover:text-brand-dark transition-colors">
            {match[2]}
          </Link>
        )
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? text : <>{parts}</>;
}

function renderBlock(block: string, i: number): ReactNode {
  const trimmed = block.trim();
  if (!trimmed) return null;

  // Horizontal rule
  if (trimmed === "---") {
    return <hr key={i} className="my-8 border-neutral-200" />;
  }

  // H2 heading
  if (trimmed.startsWith("## ")) {
    const text = trimmed.replace(/^## /, "");
    return (
      <h2 key={i} id={slugify(text)} className="text-lg font-semibold text-neutral-900 mt-8 mb-3 scroll-mt-20">
        {text}
      </h2>
    );
  }

  // H3 heading
  if (trimmed.startsWith("### ")) {
    const text = trimmed.replace(/^### /, "");
    return (
      <h3 key={i} id={slugify(text)} className="text-base font-semibold text-neutral-800 mt-6 mb-2 scroll-mt-20">
        {text}
      </h3>
    );
  }

  // Inline image: [img]url|alt|caption
  if (trimmed.startsWith("[img]")) {
    const parts = trimmed.replace("[img]", "").split("|");
    const src = parts[0]?.trim() ?? "";
    const alt = parts[1]?.trim() ?? "";
    const caption = parts[2]?.trim() ?? "";
    return (
      <figure key={i} className="my-8">
        <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 65vw"
          />
        </div>
        {caption && (
          <figcaption className="text-xs text-neutral-400 text-center mt-2 italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Unordered list — detect blocks where every line starts with "- "
  const lines = trimmed.split("\n");
  if (lines.every((l) => l.trim().startsWith("- "))) {
    const items = lines.map((l) => l.trim().replace(/^- /, ""));
    return (
      <ul key={i} className="space-y-2 mb-4 pl-1">
        {items.map((item, j) => (
          <li
            key={j}
            className="text-sm text-neutral-700 leading-relaxed flex gap-2.5"
          >
            <span className="text-brand mt-1 flex-shrink-0 text-xs">–</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Blockquote
  if (trimmed.startsWith("> ")) {
    return (
      <blockquote
        key={i}
        className="border-l-4 border-accent pl-4 my-4 py-1"
      >
        <p className="text-sm text-neutral-600 italic leading-relaxed">
          {trimmed.replace(/^> /, "")}
        </p>
      </blockquote>
    );
  }

  // Bold subheading pattern: **Label:** rest of sentence
  if (trimmed.startsWith("**") && trimmed.includes(":**")) {
    const colonIdx = trimmed.indexOf(":**");
    const bold = trimmed.slice(2, colonIdx);
    const rest = trimmed.slice(colonIdx + 3); // skip ":**"
    return (
      <p key={i} className="text-sm text-neutral-700 leading-relaxed mb-3">
        <strong className="text-neutral-900">{bold}:</strong>
        {rest}
      </p>
    );
  }

  // Plain paragraph (with inline bold + link parsing)
  return (
    <p key={i} className="text-sm text-neutral-700 leading-relaxed mb-4">
      {parseInline(trimmed)}
    </p>
  );
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // Split on blank lines (double newline) to get logical blocks
  const blocks = content.split(/\n{2,}/);

  return (
    <article className="prose-sm max-w-none">
      {blocks.map((block, i) => renderBlock(block, i))}
    </article>
  );
}
