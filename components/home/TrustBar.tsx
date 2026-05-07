"use client";

const PARTNERS = [
  { name: "QuickBooks", logo: "/partners/quickbooks.png" },
  { name: "Xero",       logo: "/partners/xero.png" },
  { name: "Sage",       logo: "/partners/sage.png" },
  { name: "Draftworx",  logo: "/partners/draftworx.png" },
  { name: "SimplePay",  logo: "/partners/simplepay.png" },
  { name: "Syft",       logo: "/partners/syft.png" },
];

const ALL = PARTNERS;

export default function TrustBar() {
  const items = [...ALL, ...ALL, ...ALL]; // triple for seamless loop at any viewport width

  return (
    <section className="border-b border-neutral-100 bg-neutral-50 py-4 overflow-hidden">
      <div className="container-page mb-3">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Software Partners
        </span>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-neutral-50 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-50 to-transparent z-10" />

        <div
          className="flex items-center gap-12"
          style={{ animation: "marquee-scroll 36s linear infinite", width: "max-content", willChange: "transform" }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-2">
              <img
                src={item.logo}
                alt={item.name}
                style={{ height: "34px", width: "auto", maxWidth: "110px", objectFit: "contain" }}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = "none";
                  const fallback = img.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "inline";
                }}
              />
              <span
                className="text-xs font-semibold text-neutral-500 tracking-wide"
                style={{ display: "none" }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
