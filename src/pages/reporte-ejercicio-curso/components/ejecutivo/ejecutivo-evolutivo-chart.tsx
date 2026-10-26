import { useState } from 'react'
import { SegmentedTabs } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { formatCompact } from '@/shared/lib/format'
import { realesN7Rows, REALES_LAST_CLOSED } from '@/data/reales'
import { PAISES_CON_REALES, RUBROS_CON_REALES, evolutivoMensualUSD, type MesEvolutivo } from '../../lib/recoe-data'

type Modo = { tipo: 'consolidado' } | { tipo: 'pais'; valor: string } | { tipo: 'rubro'; valor: string }
type Vista = 'barras' | 'puntos'

const CHART_W = 760
const CHART_H = 190
const PAD_L = 6
const PAD_B = 24
const PAD_T = 10
const PLAN_COLOR = '#94A3B8'
const REAL_COLOR = '#0047B0'
const FORECAST_COLOR = '#7FB2F0'
const ANTERIOR_COLOR = '#F59E0B'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-[11.5px] font-semibold whitespace-nowrap',
        active ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:border-primary/40',
      )}
    >
      {children}
    </button>
  )
}

/** Gráfico de línea/barras mensual Real/Plan/Año anterior/Forecast en USD, consolidado — con un
 * selector (chips) que solo afecta a este gráfico (consolidado / por país / por rubro), nunca a las
 * demás piezas de la Vista Ejecutiva, y un toggle Barras/Puntos igual al de los demás gráficos del
 * sistema (`ForecastChartSection`). */
export function EjecutivoEvolutivoChart() {
  const [modo, setModo] = useState<Modo>({ tipo: 'consolidado' })
  const [vista, setVista] = useState<Vista>('barras')

  const rows =
    modo.tipo === 'consolidado'
      ? realesN7Rows
      : modo.tipo === 'pais'
        ? realesN7Rows.filter((r) => r.pais === modo.valor)
        : realesN7Rows.filter((r) => r.rubro === modo.valor)

  const meses = evolutivoMensualUSD(rows)

  return (
    <div className="rounded-xl border border-border bg-white p-[14px_18px]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[13px] font-bold text-foreground">Evolutivo mensual — Real / Plan / Año anterior / Forecast (USD)</div>
        <SegmentedTabs
          value={vista}
          onChange={setVista}
          options={[
            { value: 'barras', label: 'Barras' },
            { value: 'puntos', label: 'Puntos' },
          ]}
        />
      </div>

      {vista === 'barras' ? <EvolutivoBars meses={meses} /> : <EvolutivoPoints meses={meses} />}

      <div className="mt-1 mb-4 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm" style={{ background: PLAN_COLOR }} /> Plan
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm" style={{ background: REAL_COLOR }} /> Real
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm" style={{ background: FORECAST_COLOR }} /> Forecast
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm" style={{ background: ANTERIOR_COLOR }} /> Año anterior
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-[#eef0f8] pt-3">
        <Chip active={modo.tipo === 'consolidado'} onClick={() => setModo({ tipo: 'consolidado' })}>
          Consolidado
        </Chip>
        {PAISES_CON_REALES.map((pais) => (
          <Chip key={pais} active={modo.tipo === 'pais' && modo.valor === pais} onClick={() => setModo({ tipo: 'pais', valor: pais })}>
            {pais}
          </Chip>
        ))}
        {RUBROS_CON_REALES.map((rubro) => (
          <Chip key={rubro} active={modo.tipo === 'rubro' && modo.valor === rubro} onClick={() => setModo({ tipo: 'rubro', valor: rubro })}>
            {rubro}
          </Chip>
        ))}
      </div>
    </div>
  )
}

function useScale(meses: MesEvolutivo[]) {
  const chartW = CHART_W - PAD_L * 2
  const chartH = CHART_H - PAD_B - PAD_T
  const yMax = Math.max(...meses.map((m) => m.plan), ...meses.map((m) => m.real), ...meses.map((m) => m.anioAnterior), 1) * 1.1
  const groupW = chartW / meses.length
  const yVal = (v: number) => PAD_T + chartH - (v / yMax) * chartH
  const monthCx = (i: number) => PAD_L + groupW * (i + 0.5)
  return { groupW, yVal, monthCx, zeroY: yVal(0) }
}

function EvolutivoBars({ meses }: { meses: MesEvolutivo[] }) {
  const { groupW, yVal, monthCx, zeroY } = useScale(meses)
  const barW = Math.min(groupW * 0.22, 22)
  const gap = 2
  const totalW = barW * 3 + gap * 2

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} className="block overflow-visible text-[11px]">
      <line x1={0} y1={zeroY} x2={CHART_W} y2={zeroY} stroke="#E4EAF6" strokeWidth={1.5} />
      {meses.map((m, i) => {
        const closed = i < REALES_LAST_CLOSED
        const cx = monthCx(i)
        const x0 = cx - totalW / 2
        const planY = yVal(m.plan)
        const realY = yVal(m.real)
        const anteriorY = yVal(m.anioAnterior)
        return (
          <g key={m.mes}>
            <rect x={x0} y={planY} width={barW} height={Math.max(zeroY - planY, 0)} rx={2} fill={PLAN_COLOR}>
              <title>
                Plan {m.label}: ${formatCompact(m.plan)}
              </title>
            </rect>
            <rect x={x0 + barW + gap} y={realY} width={barW} height={Math.max(zeroY - realY, 0)} rx={2} fill={closed ? REAL_COLOR : FORECAST_COLOR}>
              <title>
                {closed ? 'Real' : 'Forecast'} {m.label}: ${formatCompact(m.real)}
              </title>
            </rect>
            <rect x={x0 + (barW + gap) * 2} y={anteriorY} width={barW} height={Math.max(zeroY - anteriorY, 0)} rx={2} fill={ANTERIOR_COLOR}>
              <title>
                Año anterior {m.label}: ${formatCompact(m.anioAnterior)}
              </title>
            </rect>
            <text x={cx} y={CHART_H - 6} textAnchor="middle" fill="#94A3B8" fontSize={9}>
              {m.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function EvolutivoPoints({ meses }: { meses: MesEvolutivo[] }) {
  const { yVal, monthCx, zeroY } = useScale(meses)
  const planPoints = meses.map((m, i) => `${monthCx(i)},${yVal(m.plan)}`).join(' ')
  const anteriorPoints = meses.map((m, i) => `${monthCx(i)},${yVal(m.anioAnterior)}`).join(' ')
  const realPoints = meses.map((m, i) => `${monthCx(i)},${yVal(m.real)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} className="block overflow-visible text-[11px]">
      <line x1={0} y1={zeroY} x2={CHART_W} y2={zeroY} stroke="#E4EAF6" strokeWidth={1.5} />
      <polyline points={planPoints} fill="none" stroke={PLAN_COLOR} strokeWidth={1.5} strokeDasharray="4 2" />
      <polyline points={anteriorPoints} fill="none" stroke={ANTERIOR_COLOR} strokeWidth={1.5} strokeDasharray="2 2" />
      <polyline points={realPoints} fill="none" stroke={REAL_COLOR} strokeWidth={1.5} opacity={0.5} />
      {meses.map((m, i) => {
        const closed = i < REALES_LAST_CLOSED
        const cx = monthCx(i)
        return (
          <g key={m.mes}>
            <circle cx={cx} cy={yVal(m.plan)} r={2.5} fill={PLAN_COLOR}>
              <title>
                Plan {m.label}: ${formatCompact(m.plan)}
              </title>
            </circle>
            <circle cx={cx} cy={yVal(m.anioAnterior)} r={2.5} fill={ANTERIOR_COLOR}>
              <title>
                Año anterior {m.label}: ${formatCompact(m.anioAnterior)}
              </title>
            </circle>
            <circle cx={cx} cy={yVal(m.real)} r={closed ? 3.5 : 3} fill={closed ? REAL_COLOR : '#fff'} stroke={REAL_COLOR} strokeWidth={1.5}>
              <title>
                {closed ? 'Real' : 'Forecast'} {m.label}: ${formatCompact(m.real)}
              </title>
            </circle>
            <text x={cx} y={CHART_H - 6} textAnchor="middle" fill="#94A3B8" fontSize={9}>
              {m.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
