import type { GlyphProps, IconName } from './icon-types'
import { GLYPHS_A } from './icon-glyphs-a'
import { GLYPHS_B } from './icon-glyphs-b'

export type { IconName }

interface IconProps {
  name: IconName
  size?: number
  color?: string
  stroke?: number
}

const GLYPHS: Record<IconName, (p: GlyphProps) => React.ReactNode> = { ...GLYPHS_A, ...GLYPHS_B } as Record<
  IconName,
  (p: GlyphProps) => React.ReactNode
>

export function Icon({ name, size = 16, color = 'currentColor', stroke = 1.6 }: IconProps) {
  const glyph = GLYPHS[name]
  return glyph ? glyph({ s: size, color, sw: stroke }) : null
}
