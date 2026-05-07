interface GoogleMapProps {
  query: string;
  zoom?: number;
  height?: string;
  className?: string;
  title?: string;
}

export default function GoogleMap({
  query,
  zoom = 15,
  height = "h-52",
  className = "",
  title = "Google Maps",
}: GoogleMapProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`rounded-xl overflow-hidden border border-neutral-200 ${height} ${className}`}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        aria-label={title}
      />
    </div>
  );
}
