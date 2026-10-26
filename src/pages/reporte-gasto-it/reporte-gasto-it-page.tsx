import { useRef } from 'react'
import { useSearchParams } from 'react-router'
import { Breadcrumb, PageHeader } from '@/shared/ui'
import type { GitPais } from '@/data/gasto-it-v2'
import {
  accionesSugeridas,
  evolucionAcumulada,
  lineasDelAlcance,
  negocioLabel,
  pesoSobreVenta,
  totales,
  ventasDelAlcance,
  GERENCIA_OPCIONES,
  GESTOR_OPCIONES,
  NEGOCIO_OPCIONES,
  PERSPECTIVAS,
  type Alcance,
  type Perspectiva,
} from './lib'
import { PerspectivaBar } from './components/perspectiva-bar'
import { VeredictoBanner } from './components/veredicto-banner'
import { KpiRow } from './components/kpi-row'
import { AccionesCard } from './components/acciones-card'
import { EvolucionChart, EvolucionLegend } from './components/evolucion-chart'
import { DesvioRanking, type Dimension } from './components/desvio-ranking'
import { MatrizDesvio } from './components/matriz-desvio'
import { PesoVentaCard } from './components/peso-venta-card'
import { LineasTable } from './components/lineas-table'

const DIM: Record<string, Dimension> = {
  pais: { value: 'pais', label: 'País', keyFn: (l) => l.pais },
  negocio: { value: 'negocio', label: 'Negocio', keyFn: (l) => `${l.negocio} ${l.pais}` },
  gerencia: { value: 'gerencia', label: 'Gerencia IT', keyFn: (l) => l.gerencia },
  categoria: { value: 'categoria', label: 'Categoría', keyFn: (l) => l.categoria },
  proveedor: { value: 'proveedor', label: 'Proveedor', keyFn: (l) => l.proveedor },
}

/** Dimensiones del ranking de desvíos, en orden de relevancia para cada audiencia. */
const DIMENSIONES: Record<Perspectiva, Dimension[]> = {
  corporativo: [DIM.pais, DIM.negocio, DIM.gerencia, DIM.categoria],
  negocio: [DIM.categoria, DIM.gerencia, DIM.proveedor],
  it: [DIM.pais, DIM.negocio, DIM.categoria],
  gestor: [DIM.negocio, DIM.proveedor, DIM.pais],
}

const PERSPECTIVA_VALIDA = new Set(PERSPECTIVAS.map((p) => p.value))

/** Lee el alcance desde la URL, así cada vista se puede compartir con un link. */
function useAlcance(): [Alcance, (patch: Partial<Alcance>) => void] {
  const [params, setParams] = useSearchParams()
  const vista = params.get('vista') as Perspectiva | null
  const alcance: Alcance = {
    perspectiva: vista && PERSPECTIVA_VALIDA.has(vista) ? vista : 'corporativo',
    pais: (params.get('pais') as GitPais | null) ?? 'todos',
    negocio: params.get('negocio') ?? NEGOCIO_OPCIONES[0].value,
    gerencia: params.get('gerencia') ?? GERENCIA_OPCIONES[0].value,
    gestor: params.get('gestor') ?? GESTOR_OPCIONES[0].value,
  }
  const update = (patch: Partial<Alcance>) => {
    const next = { ...alcance, ...patch }
    const p = new URLSearchParams({ vista: next.perspectiva })
    if (next.pais !== 'todos') p.set('pais', next.pais)
    if (next.perspectiva === 'negocio') p.set('negocio', next.negocio)
    if (next.perspectiva === 'it') p.set('gerencia', next.gerencia)
    if (next.perspectiva === 'gestor') p.set('gestor', next.gestor)
    setParams(p, { replace: true })
  }
  return [alcance, update]
}

function alcanceLabel(a: Alcance): string {
  const pais = a.pais !== 'todos' ? ` · ${a.pais}` : ''
  if (a.perspectiva === 'negocio') return `Gasto IT de ${negocioLabel(a.negocio)}`
  if (a.perspectiva === 'it') return `${a.gerencia}${pais}`
  if (a.perspectiva === 'gestor') return `Gastos que administra ${a.gestor}${pais}`
  return `Cencosud consolidado${pais}`
}

/** Reporte Ejercicio en Curso v2 — dashboard ejecutivo del gasto IT orientado a decisiones: responde
 * "¿cómo vamos?" (veredicto + 4 cifras) y "¿qué debo hacer?" (acciones por impacto) antes de mostrar
 * cualquier gráfico, y adapta el detalle a la audiencia elegida en "Ver como". */
export function ReporteGastoItPage() {
  const [alcance, setAlcance] = useAlcance()
  const accionesRef = useRef<HTMLElement>(null)
  const p = alcance.perspectiva

  const lineas = lineasDelAlcance(alcance)
  const t = totales(lineas)
  const acciones = accionesSugeridas(lineas)
  const muestraPeso = p === 'corporativo' || p === 'negocio'
  const peso = muestraPeso ? pesoSobreVenta(lineas, ventasDelAlcance(lineas)) : undefined
  // Una dimensión con un solo valor en el alcance (ej. País con un país filtrado) no compara nada.
  const utiles = DIMENSIONES[p].filter((d) => new Set(lineas.map(d.keyFn)).size > 1)
  const dimensiones = utiles.length ? utiles : DIMENSIONES[p]

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Reportería IT' }, { label: 'Ejercicio en curso v2' }]} />
      <PageHeader title="Gasto IT — Ejercicio en curso" subtitle="¿Cómo vamos con el gasto de tecnología y qué debemos hacer al respecto?" />

      <div className="mx-8 mb-10 flex flex-col gap-4">
        <PerspectivaBar alcance={alcance} onChange={setAlcance} />

        <VeredictoBanner
          alcanceLabel={alcanceLabel(alcance)}
          t={t}
          acciones={acciones}
          onVerAcciones={() => accionesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />

        <KpiRow t={t} peso={peso} />

        <AccionesCard ref={accionesRef} acciones={acciones} />

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[3fr_2fr]">
          <section className="rounded-xl border border-border bg-white p-[14px_18px]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[14px] font-bold text-foreground">Evolución del gasto acumulado</div>
                <div className="text-[12px] text-muted-foreground">Real a la fecha y forecast hasta diciembre, contra plan y año anterior.</div>
              </div>
              <EvolucionLegend />
            </div>
            <EvolucionChart puntos={evolucionAcumulada(lineas)} />
          </section>

          {p === 'negocio' && peso ? (
            <PesoVentaCard negocio={alcance.negocio} peso={peso} />
          ) : (
            <DesvioRanking key={`${p}-${alcance.pais}`} lineas={lineas} dimensiones={dimensiones} />
          )}
        </div>

        {p === 'negocio' && <DesvioRanking key="negocio-cat" lineas={lineas} dimensiones={dimensiones} titulo="¿En qué se va el gasto IT de mi negocio?" />}

        {(p === 'corporativo' || p === 'it') && <MatrizDesvio lineas={lineas} />}

        {(p === 'it' || p === 'gestor') && <LineasTable key={`${p}-${alcance.gerencia}-${alcance.gestor}-${alcance.pais}`} lineas={lineas} />}
      </div>
    </div>
  )
}
