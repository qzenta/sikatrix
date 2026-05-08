"use client";

import { useState } from "react";
import { Linkedin, Twitter, Facebook, Link2, Check } from "lucide-react";

interface SocialShareProps {
  articleUrl: string;
  title: string;
}

export default function SocialShare({ articleUrl, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = articleUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-neutral-500 font-medium">Share:</span>
      <div className="flex items-center gap-2">
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-brand hover:text-white flex items-center justify-center text-neutral-500 transition-colors"
        >
          <Linkedin size={14} />
        </a>
        <a
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-brand hover:text-white flex items-center justify-center text-neutral-500 transition-colors"
        >
          <Twitter size={14} />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-brand hover:text-white flex items-center justify-center text-neutral-500 transition-colors"
        >
          <Facebook size={14} />
        </a>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Link copied" : "Copy article link"}
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-brand hover:text-white flex items-center justify-center text-neutral-500 transition-colors"
        >
          {copied ? <Check size={14} /> : <Link2 size={14} />}
        </button>
      </div>
    </div>
  );
}
