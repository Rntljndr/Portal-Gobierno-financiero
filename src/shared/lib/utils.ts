import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** El token de tipografía `text-xxs` (10px, tokens.css) es un tamaño, no un color: sin esto tailwind-merge lo
 * confunde con un color y lo descarta al combinarlo con `text-white`, `text-primary`, etc. */
const twMerge = extendTailwindMerge({ extend: { theme: { text: ['xxs'] } } })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Resuelve las opciones de un selector hijo según lo elegido en un selector padre, usando un mapa de cascada; sin selección, cae al listado completo. */
export function optionsFor(map: Record<string, string[]>, selected: string[], fallback: string[]): string[] {
  if (selected.length === 0) return fallback
  const merged = new Set<string>()
  selected.forEach((s) => (map[s] ?? []).forEach((v) => merged.add(v)))
  return merged.size > 0 ? [...merged].sort((a, b) => a.localeCompare(b, 'es')) : fallback
}
