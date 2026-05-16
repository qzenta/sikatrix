"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  href: string;
  icon: React.ReactNode;
  title: string;
  summary: string;
}

export function MotionServiceCard({ href, icon, title, summary }: Props) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 12px 32px 0 rgba(15,35,71,0.10)" }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="h-full"
    >
      <Link href={href} className="card p-5 group block h-full">
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2 group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed">{summary}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <ArrowRight size={12} />
        </span>
      </Link>
    </motion.div>
  );
}
