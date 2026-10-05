import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge, Button, Drawer, EmptyState, Icon, Select } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { monthLabels } from '@/data/reporteria'
import { formatFechaCorta } from '../lib/format-date'
import { anteriorAnios, applyAnterioresFilters, EMPTY_ANTERIORES_FILTERS } from '../lib/forecast-anteriores-filters'
import { ForecastActivoMiniCard } from './forecast-activo-mini-card'

interface ForecastAnterioresDrawerProps {
  open: boolean
  onClose: () => void
  rounds: ForecastRound[]
  /** F: card con nombre y fecha del forecast activo, por sobre "Buscar forecasts anteriores" — para que
   * al elegir un anterior el usuario identifique cuál es el activo. `undefined` si no hay ninguno abierto. */
  activo?: ForecastRound
}

const inputClass = 'h-[38px] w-full rounded-[10px] border-[1.5px] border-border bg-white px-3 text-[12.5px] outline-none placeholder:text-muted-foreground focus:border-primary'
const labelClass = 'mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase'

/** Card de un forecast anterior en el listado — tag Global/Parcial al lado del título, botón "Ver" en
 * el lugar donde antes iba el tag (F). */
function ForecastAnteriorCard({ round, onVer }: { round: ForecastRound; onVer: () => void }) {
  return (
    <div
      onClick={onVer}
      className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-white px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-[#F8FAFF]"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-foreground">{round.titulo}</span>
          <Badge variant="primary">{round.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          Inicio: {formatFechaCorta(round.fechaInicio)} — Fin: {formatFechaCorta(round.fechaTermino)}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          onVer()
        }}
      >
        <Icon name="eye" size={12} color="#0047B0" /> Ver
      </Button>
    </div>
  )
}

/** Drawer de "Anteriores": buscador de forecasts cerrados (solo lectura) con filtros Año → Mes →
 * Buscador — el mismo buscador también permite encontrar distintas versiones de un mismo mes (p.ej.
 * "Forecast Julio — 2026 (v1/v2/v3)", ver data/forecast.ts) filtrando por nombre. Seleccionar un
 * anterior navega a la pantalla completa (/forecast/:id) en vez de mostrar sus datos acá mismo. */
export function ForecastAnterioresDrawer({ open, onClose, rounds, activo }: ForecastAnterioresDrawerProps) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(EMPTY_ANTERIORES_FILTERS)
  const anios = useMemo(() => anteriorAnios(rounds), [rounds])
  const filtrados = useMemo(() => applyAnterioresFilters(rounds, filters), [rounds, filters])

  const seleccionar = (round: ForecastRound) => {
    onClose()
    navigate(`/forecast/${round.id}`)
  }

  return (
    <Drawer open={open} onClose={onClose} wide eyebrow="Forecast" title="Otros forecast">
      {activo && (
        <ForecastActivoMiniCard
          activo={activo}
          onIr={() => {
            onClose()
            navigate(`/forecast/${activo.id}`)
          }}
        />
      )}
      <div className="mb-3 text-[13px] font-bold text-foreground">Buscar forecasts anteriores</div>
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
            <ForecastAnteriorCard key={r.id} round={r} onVer={() => seleccionar(r)} />
          ))}
        </div>
      )}
    </Drawer>
  )
}
