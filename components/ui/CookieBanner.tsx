"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-6 md:max-w-sm z-50 bg-white rounded-xl border border-neutral-200 shadow-lg p-5">
      <div className="flex items-start gap-3 mb-3">
        <Cookie size={16} className="text-accent mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-neutral-900 mb-1">We use cookies</p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            We use cookies to improve your experience and analyse site usage.
            See our{" "}
            <Link href="/cookie-policy" className="text-brand underline">
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-brand underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <button
          onClick={decline}
          className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={accept} className="btn-primary flex-1 text-xs py-2">
          Accept All
        </button>
        <button
          onClick={decline}
          className="flex-1 text-xs py-2 px-3 rounded-md border border-neutral-200 text-neutral-600 font-medium hover:bg-neutral-50 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
