"use client";

import { motion } from "framer-motion";

const CREDENTIALS = [
  {
    badge: "SAIPA",
    title: "Professional Accountant (SA)",
    desc: "Registered member of the South African Institute of Professional Accountants — your assurance of professional and ethical practice.",
    color: "bg-brand",
  },
  {
    badge: "SARS",
    title: "Registered Tax Practitioner",
    desc: "Officially registered with the South African Revenue Service to act as your tax practitioner and submit on your behalf.",
    color: "bg-accent",
  },
  {
    badge: "IBASA",
    title: "Registered Business Adviser",
    desc: "Member of the Institute of Business Advisors Southern Africa — qualified to provide structured business advisory and mentorship services to SMEs.",
    color: "bg-brand-dark",
  },
  {
    badge: "Cloud",
    title: "Cloud Accounting Specialist",
    desc: "Certified on QuickBooks, Xero, and Sage — bringing you real-time financial management without the spreadsheet chaos.",
    color: "bg-neutral-700",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

export default function CredentialsGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
    >
      {CREDENTIALS.map((c) => (
        <motion.div
          key={c.badge}
          variants={card}
          whileHover={{ y: -4, boxShadow: "0 10px 28px 0 rgba(15,35,71,0.10)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="card p-6"
        >
          <div className={`inline-block px-2.5 py-1 rounded ${c.color} text-white text-xs font-bold mb-3`}>
            {c.badge}
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">{c.title}</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">{c.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
