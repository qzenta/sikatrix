import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface ArticleContentProps {
  content: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Parse inline markdown: `code`, **bold**, [text](url), *italic* — url may be
// an absolute http(s) link, a mailto:/tel: link, or an internal /path link.
// Italic content is parsed recursively so links inside it still render.
function parseInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex =
    /`([^`\n]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:|\/)[^)]+)\)|\*(?![\s*])([^*\n]+?)(?<!\s)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      parts.push(
        <code key={key++} className="text-xs font-mono bg-neutral-100 text-neutral-800 rounded px-1 py-0.5">
          {match[1]}
        </code>
      );
    } else if (match[2] !== undefined) {
      parts.push(<strong key={key++} className="text-neutral-900 font-semibold">{match[2]}</strong>);
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const url = match[4];
      const linkClass = "text-brand underline underline-offset-2 hover:text-brand-dark transition-colors";
      if (url.startsWith("http")) {
        parts.push(
          <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {match[3]}
          </a>
        );
      } else if (url.startsWith("mailto:") || url.startsWith("tel:")) {
        parts.push(
          <a key={key++} href={url} className={linkClass}>
            {match[3]}
          </a>
        );
      } else {
        parts.push(
          <Link key={key++} href={url} className={linkClass}>
            {match[3]}
          </Link>
        );
      }
    } else if (match[5] !== undefined) {
      parts.push(<em key={key++}>{parseInline(match[5])}</em>);
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

  const lines = trimmed.split("\n");

  // GFM pipe table: header row, separator row (|---|---|), then body rows
  if (
    lines.length >= 2 &&
    lines.every((l) => l.trim().startsWith("|")) &&
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(lines[1].trim())
  ) {
    const cells = (row: string) =>
      row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
    const header = cells(lines[0]);
    const rows = lines.slice(2).map(cells);
    return (
      <div key={i} className="my-6 max-w-full overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-xs sm:text-sm text-left text-neutral-700">
          <thead className="bg-brand-50">
            <tr>
              {header.map((h, j) => (
                <th key={j} scope="col" className="px-3 py-2 font-semibold text-neutral-900 border-b border-neutral-200">
                  {parseInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-t border-neutral-100 first:border-t-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 align-top">
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Unordered list — detect blocks where every line starts with "- "
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
            <span>{parseInline(item)}</span>
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
          {parseInline(trimmed.replace(/^> /, ""))}
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
        {parseInline(rest)}
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
  // HTML comments hold editor source notes; strip them so they never render as text
  // Normalise CRLF so Windows checkouts split into the same blocks as LF
  const blocks = content
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\n{2,}/);

  return (
    <article className="prose-sm max-w-none">
      {blocks.map((block, i) => renderBlock(block, i))}
    </article>
  );
}
