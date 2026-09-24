import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge, Drawer, EmptyState, Select } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { monthLabels } from '@/data/reporteria'
import { formatFechaCorta } from '../lib/format-date'
import { anteriorAnios, applyAnterioresFilters, EMPTY_ANTERIORES_FILTERS } from '../lib/forecast-anteriores-filters'

interface ForecastAnterioresDrawerProps {
  open: boolean
  onClose: () => void
  rounds: ForecastRound[]
}

const inputClass = 'h-[38px] w-full rounded-[10px] border-[1.5px] border-border bg-white px-3 text-[12.5px] outline-none placeholder:text-muted-foreground focus:border-primary'
const labelClass = 'mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase'

/** Filtros (Año → Mes → Buscador) + listado completo de forecasts anteriores (F) — a diferencia del
 * diseño previo, seleccionar uno navega a la pantalla completa (/forecast/:id) en vez de mostrar sus
 * datos acá mismo: con potencialmente muchos años de forecasts anteriores, el drawer es para
 * encontrar el que se busca, no para verlo. */
export function ForecastAnterioresDrawer({ open, onClose, rounds }: ForecastAnterioresDrawerProps) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(EMPTY_ANTERIORES_FILTERS)
  const anios = useMemo(() => anteriorAnios(rounds), [rounds])
  const filtrados = useMemo(() => applyAnterioresFilters(rounds, filters), [rounds, filters])

  const seleccionar = (round: ForecastRound) => {
    onClose()
    navigate(`/forecast/${round.id}`)
  }

  return (
    <Drawer open={open} onClose={onClose} wide eyebrow="Forecast" title="Forecasts anteriores">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Año</label>
          <Select
            value={filters.anio}
            onChange={(v) => setFilters((f) => ({ ...f, anio: v, mes: v ? f.mes : '' }))}
            placeholder="Todos"
            options={anios.map((a) => ({ value: a, label: a }))}
          />
        </div>
        <div>
          <label className={labelClass}>Mes</label>
          <Select
            value={filters.mes}
            onChange={(v) => setFilters((f) => ({ ...f, mes: v }))}
            placeholder={filters.anio ? 'Todos' : 'Elegí un año primero'}
            disabled={!filters.anio}
            options={filters.anio ? monthLabels.map((label, i) => ({ value: String(i + 1).padStart(2, '0'), label })) : []}
          />
        </div>
        <div>
          <label className={labelClass}>Buscar por nombre</label>
          <input className={inputClass} placeholder="Forecast 1 — 2026..." value={filters.busqueda} onChange={(e) => setFilters((f) => ({ ...f, busqueda: e.target.value }))} />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon="search" title="Sin resultados" text="Ningún forecast anterior coincide con estos filtros." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => seleccionar(r)}
              className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-[#F8FAFF]"
            >
              <div>
                <div className="text-[12.5px] font-semibold text-foreground">{r.titulo}</div>
                <div className="text-[11px] text-muted-foreground">
                  {formatFechaCorta(r.fechaInicio)} — {formatFechaCorta(r.fechaTermino)}
                </div>
              </div>
              <Badge variant="primary">{r.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
            </button>
          ))}
        </div>
      )}
    </Drawer>
  )
}
