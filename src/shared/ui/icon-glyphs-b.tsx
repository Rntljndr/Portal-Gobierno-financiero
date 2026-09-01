import type { GlyphProps, IconName } from './icon-types'

export const GLYPHS_B: Partial<Record<IconName, (p: GlyphProps) => React.ReactNode>> = {
  minus: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  sparkles: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M9 2l1.3 4.7L15 8l-4.7 1.3L9 14l-1.3-4.7L3 8l4.7-1.3L9 2z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M15.5 12l.6 2.1 2.1.6-2.1.6-.6 2.1-.6-2.1-2.1-.6 2.1-.6.6-2.1z" fill={color} />
    </svg>
  ),
  search: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="5.5" stroke={color} strokeWidth={sw} />
      <path d="M13.5 13.5L17 17" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  filter: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M3.5 4.5h13l-5 6.2v4.3l-3 1.5v-5.8l-5-6.2z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  config: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  drives: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <ellipse cx="10" cy="6" rx="7" ry="2.5" stroke={color} strokeWidth={sw} />
      <path d="M3 6v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" stroke={color} strokeWidth={sw} />
      <path d="M3 10v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4" stroke={color} strokeWidth={sw} />
    </svg>
  ),
  ceco: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="8" width="5" height="9" rx="1" stroke={color} strokeWidth={sw} />
      <rect x="12" y="3" width="5" height="14" rx="1" stroke={color} strokeWidth={sw} />
      <path d="M5 11h1M5 13h1M14 6h1M14 9h1M14 12h1" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  flag: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4 3v15" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M4 4h11l-2.5 3.5L15 11H4" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  ),
  edit: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  ),
  trash: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path
        d="M3.5 6h13M8 6V4a1.5 1.5 0 011.5-1.5h1A1.5 1.5 0 0112 4v2M5 6l1 11a1.5 1.5 0 001.5 1.3h5A1.5 1.5 0 0014 17l1-11"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  eye: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path
        d="M2 10c1.8-3.6 5-5.5 8-5.5s6.2 1.9 8 5.5c-1.8 3.6-5 5.5-8 5.5S3.8 13.6 2 10z"
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.4" stroke={color} strokeWidth={sw} />
    </svg>
  ),
  send: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M3 3l14 7-14 7 2-7-2-7z" fill={color} opacity="0.9" stroke={color} strokeWidth={sw - 0.4} strokeLinejoin="round" />
    </svg>
  ),
  download: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 3v9M6 8.5l4 4 4-4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15v1.5A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V15" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  upload: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 12V3M6 7l4-4 4 4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15v1.5A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V15" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  arrow_right: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M12 6l4 4-4 4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ejercicios: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4" width="15" height="13.5" rx="2" stroke={color} strokeWidth={sw} />
      <path d="M6 2v4M14 2v4M2.5 8.5h15" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  control: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M3 16l3.5-5 3 3L14 7l3 3" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  circle_check: ({ s }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="#067647" />
      <path d="M6 10.2l2.8 2.8L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lock: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="8" rx="1.5" stroke={color} strokeWidth={sw} />
      <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  flagCL: ({ s }) => (
    <svg width={s} height={Math.round(s * 0.72)} viewBox="0 0 25 18" fill="none">
      <rect width="25" height="9" fill="#fff" />
      <rect y="9" width="25" height="9" fill="#D52B1E" />
      <rect width="9" height="9" fill="#0039A6" />
      <path d="M4.5 2l0.7 2.2H7.5l-1.9 1.4 0.7 2.2-1.8-1.4L2.7 7.8l0.7-2.2L1.5 4.2h2.3z" fill="#fff" />
    </svg>
  ),
}
