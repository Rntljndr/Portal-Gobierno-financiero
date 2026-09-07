import { useEffect, useRef, useState } from 'react'

const PAGE_SIZE = 30
/** Recuerda cuántos bloques había cargados y el scroll del contenedor por pestaña, para restaurar la posición al volver (Ajuste R3). */
const remembered = new Map<string, { count: number; scrollTop: number }>()

/** Scroll infinito para listas de miles de filas (Ajuste R3): carga de a bloques a medida que se acerca el final, y recuerda posición/cantidad cargada por `key` al volver a montar. */
export function useInfiniteScroll(key: string, totalLength: number) {
  const [visibleCount, setVisibleCount] = useState(() => {
    const saved = remembered.get(key)?.count ?? PAGE_SIZE
    return Math.min(Math.max(saved, PAGE_SIZE), Math.max(totalLength, PAGE_SIZE))
  })
  const [loadingMore, setLoadingMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount((c) => (totalLength > 0 ? Math.min(c, totalLength) : PAGE_SIZE))
  }, [totalLength])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const saved = remembered.get(key)
    if (saved) el.scrollTop = saved.scrollTop
    const onScroll = () => remembered.set(key, { count: remembered.get(key)?.count ?? visibleCount, scrollTop: el.scrollTop })
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
    // ejecuta solo al montar/cambiar de pestaña: restaura scroll una vez y arma el listener
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    remembered.set(key, { count: visibleCount, scrollTop: containerRef.current?.scrollTop ?? remembered.get(key)?.scrollTop ?? 0 })
  }, [key, visibleCount])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || visibleCount >= totalLength) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadingMore(true)
          setTimeout(() => {
            setVisibleCount((c) => Math.min(c + PAGE_SIZE, totalLength))
            setLoadingMore(false)
          }, 350)
        }
      },
      { root: containerRef.current, rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, totalLength])

  return { visibleCount, hasMore: visibleCount < totalLength, loadingMore, containerRef, sentinelRef }
}
