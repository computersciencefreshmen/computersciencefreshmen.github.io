interface BrandMarkProps {
  className?: string;
}

/**
 * The personal brand mark has one versioned SVG source so the header, footer,
 * favicon, and social assets never drift into separate identities.
 */
export function BrandMark({ className = "" }: BrandMarkProps) {
  const classes = ["brand-mark", className].filter(Boolean).join(" ");

  return (
    <img
      className={classes}
      src="/hy-mark-v2.svg"
      alt=""
      aria-hidden="true"
      width="64"
      height="64"
    />
  );
}
