import { useState } from 'react'
import { FilterButton, Icon, SegmentedTabs } from '@/shared/ui'
import { divisionDe, V3_DIVISIONES, V3_FLAG, V3_PAISES, type V3Linea, type V3Pais } from '@/data/gasto-it-v3'
import { useReporte } from '../../lib/contexto'
import { agrupar, claseSigno, fmtHc, fmtMonto, fmtPct, headcount, medir, pesoVenta, PERIODOS, type Grupo } from '../../lib'
import { EstadoChip } from '../base/estado-chip'
import { Seccion } from '../base/seccion'

/** Nivel de la Visión Negocio: primero países, luego divisiones y luego banderas. */
type Nivel = 'pais' | 'division' | 'bandera'
const NIVELES: { value: Nivel; label: string }[] = [
  { value: 'pais', label: 'País' },
  { value: 'division', label: 'División' },
  { value: 'bandera', label: 'Bandera' },
]

const porPais = (ls: V3Linea[]) => V3_PAISES.map((p) => agrupar(ls, (l) => l.pais).find((g) => g.key === p)).filter((g): g is Grupo => Boolean(g))
const ordenDiv = (k: string) => V3_DIVISIONES.indexOf(k as (typeof V3_DIVISIONES)[number])

/** Vista rápida por país con la selección de país dentro de la propia tarjeta. Visión Tecnología: país →
 * negocio. Visión Negocio: "Ver montos por" País / División / Bandera; clic en una tarjeta baja de nivel. */
export function PaisesVista({ defaultOpen }: { defaultOpen: boolean }) {
  const { lineasAbajo, periodo, alcance, setPais, rol } = useReporte()
  const pais = alcance.pais
  // La sección se remonta al cambiar de país: con un país elegido se parte en sus divisiones.
  const [nivel, setNivel] = useState<Nivel>(pais === 'todos' ? 'pais' : 'division')
  const [division, setDivision] = useState<string | null>(null)
  const per = PERIODOS.find((p) => p.value === periodo)!
  const negocio = rol === 'negocio'
  const elegirPais = (p: V3Pais | 'todos') => {
    setDivision(null)
    setPais(p)
  }
  const elegirNivel = (n: Nivel) => {
    if (n !== 'bandera') setDivision(null)
    setNivel(n)
    if (n === 'pais' && pais !== 'todos') setPais('todos')
  }

  let grupos: Grupo[]
  let titulo: string
  let alClic: ((key: string) => void) | null = null
  if (!negocio) {
    grupos = pais === 'todos' ? porPais(lineasAbajo) : agrupar(lineasAbajo, (l) => l.negocio).sort((a, b) => b.t.plan - a.t.plan)
    titulo = pais === 'todos' ? 'Cómo vamos por país' : `Cómo vamos por negocio en ${pais}`
    if (pais === 'todos') alClic = (k) => elegirPais(k as V3Pais)
  } else {
    const ls = division ? lineasAbajo.filter((l) => divisionDe(l.negocio) === division) : lineasAbajo
    if (nivel === 'pais') {
      grupos = porPais(ls)
      alClic = (k) => elegirPais(k as V3Pais)
    } else if (nivel === 'division') {
      grupos = agrupar(ls, (l) => divisionDe(l.negocio)).sort((a, b) => ordenDiv(a.key) - ordenDiv(b.key))
      alClic = (k) => {
        setDivision(k)
        setNivel('bandera')
      }
    } else {
      grupos = agrupar(ls, (l) => (pais === 'todos' ? `${l.negocio} ${l.pais}` : l.negocio)).sort((a, b) => b.t.plan - a.t.plan)
    }
    const ambito = [pais !== 'todos' && ` en ${pais}`, division && ` · ${division}`].filter(Boolean).join('')
    titulo = `${per.label} por ${NIVELES.find((n) => n.value === nivel)!.label.toLowerCase()}${ambito}`
  }

  const acciones = negocio && (
    <div className="flex items-center gap-2">
      <div className="text-xxs font-bold text-primary">Ver montos por</div>
      <SegmentedTabs size="sm" value={nivel} onChange={elegirNivel} options={NIVELES} />
    </div>
  )

  return (
    <Seccion titulo={titulo} subtitulo={`${per.label}${alClic ? ' · haz clic en una tarjeta para abrirla.' : ''}`} acciones={acciones} defaultOpen={defaultOpen}>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton size="sm" active={pais === 'todos'} onClick={() => elegirPais('todos')}>
            Todos los países
          </FilterButton>
          {V3_PAISES.map((p) => (
            <FilterButton key={p} size="sm" active={pais === p} onClick={() => elegirPais(p)}>
              <span className="text-base leading-none">{V3_FLAG[p]}</span>
              {p}
            </FilterButton>
          ))}
        </div>
        {negocio && division && (
          <nav aria-label="Nivel" className="flex flex-wrap items-center gap-2 text-sm">
            <button type="button" onClick={() => elegirNivel('division')} className="font-medium text-primary hover:underline">
              {pais === 'todos' ? 'Todas las divisiones' : `Divisiones de ${pais}`}
            </button>
            <Icon name="chevron_right" size={14} color="currentColor" />
            <span className="font-bold text-foreground">{division}</span>
          </nav>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {grupos.map((g) => (
          <Tarjeta key={g.key} titulo={g.key} flag={V3_FLAG[g.key as V3Pais]} lineas={g.lineas} onClick={alClic ? () => alClic(g.key) : undefined} />
        ))}
      </div>
    </Seccion>
  )
}

function Tarjeta({ titulo, flag, lineas, onClick }: { titulo: string; flag?: string; lineas: V3Linea[]; onClick?: () => void }) {
  const { moneda, periodo } = useReporte()
  const m = medir(lineas, periodo)
  const hc = headcount(lineas)
  const contenido = (
    <>
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        {flag && <span className="text-2xl leading-none">{flag}</span>}
        {titulo}
      </div>
      <div className="text-lg font-bold text-foreground tabular-nums">{fmtMonto(m.valor, moneda)}</div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <EstadoChip pct={m.desvPct} />
        <span className={claseSigno(m.varPct)}>var. {fmtPct(m.varPct, true)}</span>
      </div>
      <div className="text-xs text-muted-foreground">{fmtPct(pesoVenta(lineas, periodo).real, false, 2)} sobre la venta</div>
      {hc.aplica && (
        <div className="text-xs text-muted-foreground">
          HC <span className="font-bold text-foreground">{fmtHc(hc.real)}</span> / {fmtHc(hc.plan)} plan
        </div>
      )}
    </>
  )
  const clase = 'flex flex-col gap-1 rounded-xl border border-border-table bg-white p-3 text-left'
  return onClick ? (
    <button type="button" onClick={onClick} className={`${clase} hover:border-primary hover:bg-surface-hover`}>
      {contenido}
    </button>
  ) : (
    <div className={clase}>{contenido}</div>
  )
}
