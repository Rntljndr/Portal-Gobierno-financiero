import { useState } from 'react'
import { V3_FLAG, V3_PAISES, type V3Pais } from '@/data/gasto-it-v3'
import { FilterButton, Tag } from '@/shared/ui'
import { useReporte } from '../../lib/contexto'
import { estadoSigno, mensual, mesLargo, mesOrigenDesvio } from '../../lib'
import { LineaMensual, LineaMensualLeyenda } from '../base/linea-mensual'
import { Seccion } from '../base/seccion'

type Chip = { tipo: 'todo' } | { tipo: 'pais'; valor: string }

/** Evolutivo mensual Plan / Real / Forecast. Los chips (consolidado o país) solo afectan a este gráfico. */
export function EvolutivoCard({ defaultOpen }: { defaultOpen: boolean }) {
  const { lineasAbajo: lineas, ajustes, moneda } = useReporte()
  const [chip, setChip] = useState<Chip>({ tipo: 'todo' })
  const paises = V3_PAISES.filter((p) => lineas.some((l) => l.pais === p))
  const ls = chip.tipo === 'todo' ? lineas : lineas.filter((l) => l.pais === chip.valor)
  const origen = mesOrigenDesvio(ls, ajustes.tolerancia)
  // Semáforo del último mes cerrado: rojo sobre plan, verde bajo plan, gris dentro de la tolerancia.
  const meses = mensual(ls)
  const ultimo = meses.filter((m) => m.cerrado).at(-1)
  const estado = ultimo && ultimo.plan > 0 ? estadoSigno(((ultimo.valor - ultimo.plan) / ultimo.plan) * 100) : 'tolerancia'
  const desde = origen !== null ? ` desde ${mesLargo(origen)}` : ''
  const tag = {
    sobre: { color: 'red' as const, texto: `▲ Sobre plan${desde}` },
    bajo: { color: 'green' as const, texto: `▼ Bajo plan${desde}` },
    tolerancia: { color: 'gray' as const, texto: '● En el plan' },
  }[estado]
  const titulo = (
    <span className="flex flex-wrap items-center gap-2">
      Mes a mes
      <Tag color={tag.color}>{tag.texto}</Tag>
    </span>
  )
  const activo = (c: Chip) => c.tipo === chip.tipo && (c.tipo === 'todo' || (chip.tipo !== 'todo' && c.valor === chip.valor))

  const chips: { c: Chip; label: string; flag?: string }[] = [
    { c: { tipo: 'todo' }, label: 'Consolidado' },
    ...(paises.length > 1 ? paises.map((p: V3Pais) => ({ c: { tipo: 'pais', valor: p } as Chip, label: p, flag: V3_FLAG[p] })) : []),
  ]

  return (
    <Seccion titulo={titulo} subtitulo="Plan, Real (meses cerrados) y Forecast (meses restantes), mes a mes." defaultOpen={defaultOpen}>
      {chips.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {chips.map(({ c, label, flag }) => (
            <FilterButton key={label} size="sm" active={activo(c)} onClick={() => setChip(c)}>
              {flag && <span className="text-base leading-none">{flag}</span>}
              {label}
            </FilterButton>
          ))}
        </div>
      )}
      <LineaMensual meses={meses} moneda={moneda} ancho={1240} />
      <div className="mt-4 border-t border-border-table pt-4">
        <LineaMensualLeyenda />
      </div>
    </Seccion>
  )
}
