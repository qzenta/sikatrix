"use client";

import { useEffect, useState } from "react";

export type TocHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

interface TableOfContentsProps {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="card p-5">
      <p className="text-2xs font-semibold uppercase tracking-widest text-accent mb-4">
        In this article
      </p>
      <nav>
        <ul className="space-y-1">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block text-xs leading-snug py-1 transition-colors ${
                  level === 3 ? "pl-3" : ""
                } ${
                  activeId === id
                    ? "text-brand font-semibold"
                    : "text-neutral-500 hover:text-brand"
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
