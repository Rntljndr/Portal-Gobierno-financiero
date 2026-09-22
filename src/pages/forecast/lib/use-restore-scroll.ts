import { useEffect, useRef } from 'react'

/** Recuerda el scroll del contenedor por `key` y lo restaura al volver a montar (Ajuste T2) — mismo
 * patrón de Map a nivel de módulo que `reales/lib/use-infinite-scroll.ts` usa para lo mismo. */
const rememberedScroll = new Map<string, number>()

export function useRestoreScroll<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const saved = rememberedScroll.get(key)
    if (saved) el.scrollTop = saved
    const onScroll = () => rememberedScroll.set(key, el.scrollTop)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [key])

  return ref
}
