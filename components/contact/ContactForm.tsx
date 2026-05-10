"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2, MessageSquare, AlertCircle, Navigation } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import { SITE } from "@/lib/site";

const SERVICES_LIST = [
  "Annual Financial Statements",
  "Tax Services",
  "Bookkeeping",
  "Payroll",
  "Cloud Accounting",
  "Company Secretarial",
  "Business Permit Support",
  "Import/Export License",
  "Other / Not sure",
];

const KEY_SERVICES = [
  { label: "Tax Services", href: "/services/tax-services" },
  { label: "Bookkeeping", href: "/services/bookkeeping" },
  { label: "Annual Financial Statements", href: "/services/annual-financial-statements" },
  { label: "Payroll Services", href: "/services/payroll" },
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  _trap: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    _trap: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      sendGAEvent("event", "generate_lead", { event_category: "contact_form" });
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <section className="py-16 md:py-20 bg-neutral-50 border-t-[3px] border-accent">
      <div className="container-page">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Form column */}
          <div className="lg:col-span-2">
            {status === "success" ? (
              <div className="card p-12 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                  Message received!
                </h2>
                <p className="text-sm text-neutral-500 mb-2 max-w-sm mx-auto">
                  We'll review your enquiry and respond within one business day.
                </p>
                <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
                  Check your inbox — we've sent a confirmation to your email. If it's urgent, call us directly on{" "}
                  <a href={`tel:${SITE.phoneRaw}`} className="text-brand hover:underline">
                    {SITE.phone}
                  </a>
                  .
                </p>
                <Link href="/" className="btn-outline text-sm">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", overflow: "hidden" }}>
                  <label htmlFor="_trap">Leave this blank</label>
                  <input
                    type="text"
                    id="_trap"
                    name="_trap"
                    value={form._trap}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Error banner */}
                <div role="alert" aria-live="polite">
                  {status === "error" && errorMsg && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{errorMsg}</p>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="cf-name" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Dlamini"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-email" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cf-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@company.co.za"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="cf-phone" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+27 82 000 0000"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-company" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Company Name
                    </label>
                    <input
                      id="cf-company"
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="My Business (Pty) Ltd"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cf-service" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Service Required
                  </label>
                  <select
                    id="cf-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors bg-white"
                  >
                    <option value="">Select a service…</option>
                    {SERVICES_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cf-message" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Tell us about your business <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="cf-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Briefly describe your business, your current accounting setup, and what you need help with…"
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5">
                  <input type="checkbox" id="consent" required className="mt-0.5 accent-brand" />
                  <label htmlFor="consent" className="text-xs text-neutral-500 leading-relaxed">
                    I agree to Sikatrix processing my personal information in accordance with the{" "}
                    <Link href="/privacy-policy" className="text-brand underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/popia" className="text-brand underline">
                      POPIA Notice
                    </Link>
                    . I understand I may withdraw consent at any time.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full py-3 text-sm disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    "Send Enquiry"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Calendly — book a call */}
            <div className="rounded-xl bg-brand-dark p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">Book a Call</span>
              </div>
              <h3 className="text-base font-semibold mb-1">Free 15-Minute Discovery Call</h3>
              <p className="text-sm text-white/70 mb-4">
                Pick a time that suits you. No obligation — just a quick chat about your accounting needs.
              </p>
              <a
                href="https://calendly.com/onukpa/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white transition-colors"
              >
                Choose a Time →
              </a>
            </div>

            {/* Contact details */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Contact Details</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-neutral-600">
                  <MapPin size={15} className="text-brand mt-0.5 flex-shrink-0" />
                  <span>
                    {SITE.address.full} —{" "}
                    <Link href="/locations/alberton" className="text-brand hover:underline">
                      Alberton office
                    </Link>
                  </span>
                </li>
                <li>
                  <a
                    href={`tel:${SITE.phoneRaw}`}
                    className="flex gap-3 text-sm text-neutral-600 hover:text-brand transition-colors"
                  >
                    <Phone size={15} className="text-brand mt-0.5 flex-shrink-0" />
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="flex gap-3 text-sm text-neutral-600 hover:text-brand transition-colors"
                  >
                    <Mail size={15} className="text-brand mt-0.5 flex-shrink-0" />
                    {SITE.email}
                  </a>
                </li>
                <li className="flex gap-3 text-sm text-neutral-600">
                  <Clock size={15} className="text-brand mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <div>{SITE.hours.weekdays}</div>
                    <div>{SITE.hours.saturday}</div>
                    <div>{SITE.hours.sunday}</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=Hi%2C%20I'd%20like%20to%20book%20a%20consultation`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900">Chat on WhatsApp</div>
                <div className="text-xs text-neutral-500">Quick responses during office hours</div>
              </div>
            </a>

            {/* Directions card */}
            <a
              href="https://maps.google.com/?q=42+Hennie+Alberts+Street+Brackenhurst+Alberton+1448"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl bg-brand-dark hover:bg-brand transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                <Navigation size={18} className="text-accent-light" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Get Directions</div>
                <div className="text-xs text-white/60 leading-snug mt-0.5">
                  42 Hennie Alberts St, Brackenhurst<br />Alberton, 1448
                </div>
              </div>
            </a>

            {/* Key services quick links */}
            <div className="card p-5">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                Popular Services
              </h3>
              <ul className="space-y-2">
                {KEY_SERVICES.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="flex items-center gap-2 text-sm text-neutral-700 hover:text-brand transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      {s.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link href="/services" className="text-xs text-brand hover:underline font-medium">
                    View all services →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
