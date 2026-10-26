import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Icon, type IconName } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { servicios } from '@/data/services'
import { ACCESOS } from '../lib/accesos'

interface Resultado {
  to: string
  icono: IconName
  titulo: string
  sub: string
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function buscar(q: string): Resultado[] {
  const t = norm(q.trim())
  if (!t) return []
  const pantallas = ACCESOS.filter((a) => norm(`${a.label} ${a.claves ?? ''}`).includes(t)).map((a) => ({ to: a.to, icono: a.icono, titulo: a.label, sub: 'Pantalla' }))
  const lineas = servicios
    .filter((s) => norm(`${s.nombre} ${s.pep} ${s.codigo}`).includes(t))
    .slice(0, 5)
    .map((s) => ({ to: `/ejercicios/mis-servicios/${s.id}`, icono: 'edit' as IconName, titulo: s.nombre, sub: `${s.pep} · ${s.pais}` }))
  return [...pantallas, ...lineas].slice(0, 8)
}

/** Buscador global (⌘K / Ctrl+K): pantallas del portal y líneas presupuestarias por nombre, PEP o código. */
export function Buscador() {
  const navigate = useNavigate()
  const ref = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const resultados = buscar(q)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const ir = (r: Resultado) => {
    setAbierto(false)
    navigate(r.to)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') setActivo((i) => Math.min(i + 1, resultados.length - 1))
    else if (e.key === 'ArrowUp') setActivo((i) => Math.max(i - 1, 0))
    else if (e.key === 'Enter' && resultados[activo]) ir(resultados[activo])
    else if (e.key === 'Escape') ref.current?.blur()
  }

  return (
    <div className="relative w-full max-w-[420px]">
      <label className="flex h-[41px] items-center gap-2 rounded-lg border border-border-strong bg-white px-3 text-muted-foreground focus-within:border-primary">
        <Icon name="search" size={16} color="currentColor" />
        <input
          ref={ref}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setActivo(0)
            setAbierto(true)
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setTimeout(() => setAbierto(false), 150)}
          onKeyDown={onKeyDown}
          placeholder="Buscar pantalla, servicio o PEP"
          aria-label="Buscar en el portal"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <kbd className="rounded border border-border-strong px-1.5 text-xs font-medium">⌘K</kbd>
      </label>
      {abierto && q.trim() && (
        <div className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-border-table bg-white shadow-m" role="listbox">
          {resultados.length === 0 && <div className="px-3 py-3 text-sm text-muted-foreground">Sin resultados para "{q}"</div>}
          {resultados.map((r, i) => (
            <button
              key={r.to + r.titulo}
              type="button"
              role="option"
              aria-selected={i === activo}
              onMouseDown={() => ir(r)}
              onMouseEnter={() => setActivo(i)}
              className={cn('flex w-full items-center gap-3 px-3 py-2 text-left', i === activo && 'bg-surface-hover')}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-info-surface text-primary">
                <Icon name={r.icono} size={14} color="currentColor" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{r.titulo}</span>
                <span className="block truncate text-xs text-muted-foreground">{r.sub}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
