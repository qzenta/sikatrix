import type { Metadata } from "next";
import { SITE } from "./site";

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/resources?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.province,
      postalCode: SITE.address.postalCode,
      addressCountry: "ZA",
    },
    sameAs: [
      SITE.social.facebook,
      SITE.social.linkedin,
      SITE.social.twitter,
    ],
    foundingDate: "2014",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 5 },
  };
}

export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Amoah",
    jobTitle: "Founder & Professional Accountant (SA)",
    worksFor: {
      "@type": "AccountingService",
      name: SITE.name,
      url: SITE.url,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.province,
      addressCountry: "ZA",
    },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "SAIPA Professional Accountant (SA)" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "SARS Registered Tax Practitioner" },
    ],
    url: `${SITE.url}/about`,
    image: `${SITE.url}/about/daniel-amoah.jpg`,
  };
}

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title: { absolute: `${title} | ${SITE.name}` },
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: "en_ZA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function buildLocalBusinessSchema(locationName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: locationName ?? SITE.address.city,
      addressRegion: SITE.address.province,
      postalCode: SITE.address.postalCode,
      addressCountry: "ZA",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "13:00",
      },
    ],
    hasCredential: SITE.certifications,
    areaServed: [
      { "@type": "City", name: "Alberton", containedInPlace: { "@type": "State", name: "Gauteng" } },
      { "@type": "City", name: "Johannesburg", containedInPlace: { "@type": "State", name: "Gauteng" } },
      { "@type": "City", name: "Sandton", containedInPlace: { "@type": "State", name: "Gauteng" } },
      { "@type": "City", name: "Randburg", containedInPlace: { "@type": "State", name: "Gauteng" } },
      { "@type": "City", name: "Vereeniging", containedInPlace: { "@type": "State", name: "Gauteng" } },
      { "@type": "City", name: "Germiston", containedInPlace: { "@type": "State", name: "Gauteng" } },
      { "@type": "City", name: "Boksburg", containedInPlace: { "@type": "State", name: "Gauteng" } },
      { "@type": "City", name: "Midrand", containedInPlace: { "@type": "State", name: "Gauteng" } },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: -26.2844,
      longitude: 28.1218,
    },
    hasMap: "https://maps.google.com/?q=42+Hennie+Alberts+Street,+Brackenhurst,+Alberton,+1448",
    priceRange: "$$",
    currenciesAccepted: "ZAR",
    paymentAccepted: "Cash, EFT, Credit Card",
    image: `${SITE.url}/logo.png`,
    sameAs: [
      SITE.social.facebook,
      SITE.social.linkedin,
      SITE.social.twitter,
    ],
  };
}

export function buildServiceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "AccountingService",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.province,
        postalCode: SITE.address.postalCode,
        addressCountry: "ZA",
      },
    },
    areaServed: { "@type": "State", name: "Gauteng", containedInPlace: { "@type": "Country", name: "South Africa" } },
    serviceType: "Accounting",
  };
}

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
