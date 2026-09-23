import React from "react";

/**
 * The four actions need four glyphs that are distinguishable at 16px and read
 * as what they do. Drawn here rather than pulled from an icon package: six
 * paths do not justify a dependency in a bundle this small.
 */

type Props = { className?: string };

function Frame({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Text with its styling shed: full line, short line, shorter line. */
export const PlainIcon = ({ className }: Props): JSX.Element => (
  <Frame className={className}>
    <path d="M2.8 4h10.4M2.8 8h7.4M2.8 12h4.4" />
  </Frame>
);

/** Structure kept: a heading rule above body lines. */
export const CleanIcon = ({ className }: Props): JSX.Element => (
  <Frame className={className}>
    <path d="M2.8 3.6h6.4" strokeWidth={2.2} />
    <path d="M2.8 7.6h10.4M2.8 10.6h10.4M2.8 13.4h6.8" />
  </Frame>
);

/** The Markdown chevron-and-rule, simplified. */
export const MarkdownIcon = ({ className }: Props): JSX.Element => (
  <Frame className={className}>
    <path d="M2.4 11.2V4.8l2.6 3 2.6-3v6.4" />
    <path d="M10.4 4.8v6.4M8.2 9l2.2 2.2L12.6 9" />
  </Frame>
);

/** Text arriving at a caret. */
export const PasteIcon = ({ className }: Props): JSX.Element => (
  <Frame className={className}>
    <path d="M8 1.8v7.6M5.2 6.8 8 9.6l2.8-2.8" />
    <path d="M2.6 11.4v1.6a1.2 1.2 0 0 0 1.2 1.2h8.4a1.2 1.2 0 0 0 1.2-1.2v-1.6" />
  </Frame>
);

export const GearIcon = ({ className }: Props): JSX.Element => (
  <Frame className={className}>
    <circle cx="8" cy="8" r="2.2" />
    <path d="M13 9.6a1.1 1.1 0 0 0 .22 1.21l.04.04a1.33 1.33 0 1 1-1.89 1.89l-.04-.04a1.1 1.1 0 0 0-1.21-.22 1.1 1.1 0 0 0-.67 1v.12a1.33 1.33 0 0 1-2.66 0v-.06a1.1 1.1 0 0 0-.72-1 1.1 1.1 0 0 0-1.21.22l-.04.04a1.33 1.33 0 1 1-1.89-1.89l.04-.04a1.1 1.1 0 0 0 .22-1.21 1.1 1.1 0 0 0-1-.67h-.12a1.33 1.33 0 1 1 0-2.66h.06a1.1 1.1 0 0 0 1-.72 1.1 1.1 0 0 0-.22-1.21l-.04-.04a1.33 1.33 0 1 1 1.89-1.89l.04.04a1.1 1.1 0 0 0 1.21.22h.05a1.1 1.1 0 0 0 .67-1v-.12a1.33 1.33 0 0 1 2.66 0v.06a1.1 1.1 0 0 0 .67 1 1.1 1.1 0 0 0 1.21-.22l.04-.04a1.33 1.33 0 1 1 1.89 1.89l-.04.04a1.1 1.1 0 0 0-.22 1.21v.05a1.1 1.1 0 0 0 1 .67h.12a1.33 1.33 0 1 1 0 2.66h-.06a1.1 1.1 0 0 0-1 .67z" />
  </Frame>
);

export const CheckIcon = ({ className }: Props): JSX.Element => (
  <Frame className={className}>
    <path d="M3.2 8.4 6.5 11.7 12.8 4.6" strokeWidth={1.7} />
  </Frame>
);

export const AlertIcon = ({ className }: Props): JSX.Element => (
  <Frame className={className}>
    <circle cx="8" cy="8" r="5.8" />
    <path d="M8 5.1v3.4M8 10.8h.01" />
  </Frame>
);
