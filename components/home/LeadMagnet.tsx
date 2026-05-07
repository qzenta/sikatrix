"use client";

import { useState } from "react";
import { CheckCircle, Download, Loader2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Income Tax Return (ITR12 / ITR14)",
  "Provisional Tax (IRP6): 2 submissions per year",
  "VAT Returns (VAT201): monthly or bi-monthly",
  "PAYE / EMP201: monthly payroll taxes",
  "Annual Employer Reconciliation (EMP501)",
  "CIPC Annual Return",
  "UIF and SDL declarations",
  "Workmen's Compensation (COIDA) annual return",
];

export default function LeadMagnet() {
  const [name, setName] = useState("");
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
        body: JSON.stringify({ name, email, source: "lead-magnet" }),
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

  return (
    <section className="py-16 md:py-20 bg-brand-dark">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: checklist */}
          <div>
            <span className="inline-block text-accent-light text-xs font-semibold uppercase tracking-widest mb-3">
              Free Resource
            </span>
            <h2 className="text-2xl font-semibold text-white mb-4 leading-snug">
              The SARS Compliance Checklist Every South African Business Owner Needs
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed mb-6">
              Never miss a SARS deadline again. Download our annual compliance checklist
              covering every submission a typical SME is obligated to make.
            </p>
            <ul className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-brand-100">
                  <CheckCircle size={13} className="text-accent-light flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl p-8">
            {status === "success" ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Checklist on its way!
                </h3>
                <p className="text-sm text-neutral-500">
                  Check your inbox. We've also added you to our monthly tax tips newsletter.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">
                  Get the free checklist
                </h3>
                <p className="text-xs text-neutral-500 mb-5">
                  Delivered instantly. No spam, ever.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" name="_trap" className="hidden" tabIndex={-1} autoComplete="off" />
                  <div>
                    <label htmlFor="lead-name" className="block text-xs font-medium text-neutral-700 mb-1">
                      Your name
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Dlamini"
                      className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-medium text-neutral-700 mb-1">
                      Business email
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@yourcompany.co.za"
                      required
                      className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-xs text-red-600">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary w-full py-3 text-sm mt-2"
                  >
                    {status === "loading" ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <>
                        <Download size={14} />
                        Send me the checklist
                      </>
                    )}
                  </button>
                </form>
                <p className="text-2xs text-neutral-400 mt-3 text-center leading-relaxed">
                  By submitting you agree to our{" "}
                  <a href="/privacy-policy" className="underline hover:text-brand">
                    Privacy Policy
                  </a>
                  . Unsubscribe at any time.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
