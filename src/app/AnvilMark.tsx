interface AnvilMarkProps {
  size?: number;
}

/** The Forge mark: hammer/anvil, one-color so phase accents can tint it. */
export function AnvilMark({ size = 26 }: AnvilMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 6h14.2c.2 2.6 1.9 4.2 4.3 4.6-1.1 2.3-3.2 3.4-5.8 3.4h-4.9c-1.4 0-2.4-.7-2.8-1.9H6.7c-.4 1.6-1.6 2.7-3.7 2.9v-2.1c1.3-.2 2-.9 2.2-2.3l.2-1.1H3V6z"
        fill="currentColor"
      />
      <path d="M8.2 15.6h7.6l1.3 2.9H6.9l1.3-2.9z" fill="currentColor" />
    </svg>
  );
}
