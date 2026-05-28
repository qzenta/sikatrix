"use client";

const PARTNERS = [
  { name: "QuickBooks", logo: "/partners/quickbooks.png" },
  { name: "Xero",       logo: "/partners/xero.png" },
  { name: "Sage",       logo: "/partners/sage.png" },
  { name: "Draftworx",  logo: "/partners/draftworx.png" },
  { name: "SimplePay",  logo: "/partners/simplepay.png" },
  { name: "Syft",       logo: "/partners/syft.png" },
];

export default function TrustBar() {
  // Two copies inside ONE flex container — keyframe translates exactly -50% to loop seamlessly.
  // Each slot has a FIXED width (192px) so max-content is stable and -50% always lands
  // precisely on the first item of the second copy (6 × 192 = 1152px = 50% of 2304px).
  const items = [...PARTNERS, ...PARTNERS];

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
          className="flex items-center"
          style={{
            animation: "marquee-scroll 30s linear infinite",
            willChange: "transform",
            // Force a dedicated GPU compositing layer — prevents layout recalculations
            // during page scroll from disrupting the animation mid-cycle.
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "192px",   // fixed slot — spacing is baked in, not from gap
                height: "76px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={item.logo}
                alt={item.name}
                style={{
                  maxHeight: "62px",
                  maxWidth: "160px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
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
