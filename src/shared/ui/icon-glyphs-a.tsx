import type { GlyphProps, IconName } from './icon-types'

export const GLYPHS_A: Partial<Record<IconName, (p: GlyphProps) => React.ReactNode>> = {
  dashboard: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.8" stroke={color} strokeWidth={sw} />
      <rect x="11" y="2" width="7" height="7" rx="1.8" stroke={color} strokeWidth={sw} />
      <rect x="2" y="11" width="7" height="7" rx="1.8" stroke={color} strokeWidth={sw} />
      <rect x="11" y="11" width="7" height="7" rx="1.8" stroke={color} strokeWidth={sw} />
    </svg>
  ),
  calendar: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="4" width="15" height="13.5" rx="2" stroke={color} strokeWidth={sw} />
      <path d="M6 2v4M14 2v4M2.5 8.5h15" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  bell: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 3a5 5 0 00-5 5v3l-1.5 2h13L15 11V8a5 5 0 00-5-5z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M8.5 16a1.5 1.5 0 003 0" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  chart: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M3 17h14" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <rect x="4" y="10" width="3" height="6" rx="0.8" fill={color} opacity="0.7" />
      <rect x="8.5" y="6" width="3" height="10" rx="0.8" fill={color} opacity="0.9" />
      <rect x="13" y="3" width="3" height="13" rx="0.8" fill={color} />
    </svg>
  ),
  chevron_left: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M12.5 4l-5 6 5 6" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron_right: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M7.5 4l5 6-5 6" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron_up: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M5 12.5l5-5 5 5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron_down: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5l5 5 5-5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M9 4H4v12h5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 7l3 3-3 3M7 10h9" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  user: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke={color} strokeWidth={sw} />
      <path d="M3 17c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  check: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4 10l4 4 8-9" stroke={color} strokeWidth={sw + 0.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  x_close: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  dollar: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path
        d="M13 6.5c0-1.4-1.3-2.5-3-2.5S7 5.1 7 6.5s1.3 2 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5-3-1.1-3-2.5"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path d="M10 3v14" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  trendup: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M3 14l4-4 3 3 6-7" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 6h5v5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  alert: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 3l8 14H2L10 3z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M10 8v4" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.8" fill={color} />
    </svg>
  ),
  info: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth={sw} />
      <path d="M10 9v5M10 6.5v.01" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  ),
  play: ({ s, color }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill={color}>
      <path d="M5 3.5v13l11-6.5z" />
    </svg>
  ),
  view_cards: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="2.5" width="6.2" height="6.2" rx="1.6" stroke={color} strokeWidth={sw} />
      <rect x="11.3" y="2.5" width="6.2" height="6.2" rx="1.6" stroke={color} strokeWidth={sw} />
      <rect x="2.5" y="11.3" width="6.2" height="6.2" rx="1.6" stroke={color} strokeWidth={sw} />
      <rect x="11.3" y="11.3" width="6.2" height="6.2" rx="1.6" stroke={color} strokeWidth={sw} />
    </svg>
  ),
  view_table: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="3" width="15" height="3.6" rx="1.4" stroke={color} strokeWidth={sw} />
      <rect x="2.5" y="8.2" width="15" height="3.6" rx="1.4" stroke={color} strokeWidth={sw} />
      <rect x="2.5" y="13.4" width="15" height="3.6" rx="1.4" stroke={color} strokeWidth={sw} />
    </svg>
  ),
  plus: ({ s, color, sw }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke={color} strokeWidth={sw + 0.3} strokeLinecap="round" />
    </svg>
  ),
  dots: ({ s, color }) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill={color}>
      <circle cx="4" cy="10" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="16" cy="10" r="1.6" />
    </svg>
  ),
}
