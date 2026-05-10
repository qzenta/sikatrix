import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: { absolute: "Book a Free Consultation | Sikatrix Business Accountants" },
  description:
    "Book a free 30-minute consultation with Sikatrix. Serving businesses across Alberton, Johannesburg, and Gauteng. Response within one business day.",
  alternates: { canonical: "https://www.sikatrix.com/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Book a Free Consultation"
        subtitle="Tell us about your business and we'll respond within one business day. No obligation, no jargon. Just a straight conversation about your accounting needs."
        crumbs={[{ label: "Contact" }]}
        size="sm"
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=60"
      />
      <ContactForm />
    </>
  );
}
