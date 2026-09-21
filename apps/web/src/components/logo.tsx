/**
 * Typographic wordmark per Build Ruleset §8.4: custom letter-spacing on a
 * display face already in the token system, plus exactly one geometric
 * modification — an amber underline beneath "wire" only, standing in for
 * a ticker-tape tick. No figurative/illustrative mark.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 40" className={className} role="img" aria-label="Nightwire">
      <text
        x="0"
        y="28"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight={600}
        fontSize={26}
        letterSpacing={0.5}
        fill="currentColor"
      >
        Night
        <tspan fill="var(--color-lamp-amber)">wire</tspan>
      </text>
      <line
        x1={129}
        y1={34}
        x2={216}
        y2={34}
        stroke="var(--color-lamp-amber)"
        strokeWidth={2}
      />
    </svg>
  );
}
