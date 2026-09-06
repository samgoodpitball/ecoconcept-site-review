/**
 * Собственный набор иконок: единая сетка 24, одна толщина штриха 1.5.
 * Эмодзи и юникод-глифы вместо иконок не используются — правило craft-floor.
 */
type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconSun = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const IconHeat = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M7 14a5 5 0 1 0 10 0c0-3-2-4-2-8 0 0-3 1-3 4 0-2-1-3-1-3s-4 3-4 7Z" />
  </svg>
);

export const IconCombo = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="8" cy="9" r="3" />
    <path d="M8 3v1M8 15v-1M3.8 4.8l.7.7M12.2 4.8l-.7.7" />
    <path d="M13 18a4 4 0 1 0 8 0c0-2.4-1.6-3.2-1.6-6.4 0 0-2.4.8-2.4 3.2 0-1.6-.8-2.4-.8-2.4S13 14.8 13 18Z" />
  </svg>
);

export const IconArrow = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconPhone = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
  </svg>
);

export const IconWhatsapp = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3.5 20.5 5 16a8 8 0 1 1 3 3l-4.5 1.5Z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.4 1-1v-.8l-1.8-.8-.8 1a5.5 5.5 0 0 1-2.3-2.3l1-.8-.8-1.8h-.8c-.6 0-1 .4-1 1Z" />
  </svg>
);

export const IconMenu = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconClose = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconChevron = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconCheck = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const IconMinus = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14" />
  </svg>
);
