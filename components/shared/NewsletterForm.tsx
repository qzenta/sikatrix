"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-white">
        <CheckCircle size={16} className="text-accent-light flex-shrink-0" />
        <span>You&apos;re subscribed. Check your inbox for a confirmation.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input type="text" name="_trap" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.co.za"
          required
          className="flex-1 px-4 py-2.5 rounded-md text-sm bg-white/10 border border-white/20 text-white placeholder:text-brand-100 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap"
        >
          {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-300 text-center">{errorMsg}</p>
      )}
    </form>
  );
}
