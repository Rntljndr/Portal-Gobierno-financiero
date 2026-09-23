import { paisMoneda as paisMonedaMap, type Pais, type Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { fragmentsFor } from './vista-amounts'
import { justificacionDesvioDe } from './dimensiones'

export interface ServicioLineaRow {
  key: string
  pepN4: string
  servicio: string
  centroCosto: string
  gerencia: string
  equipo: string
  rubro: string
  cuentaContable: string
  origen: Pais
  destino: Pais
  moneda: string
  plan: number
  forecastIPC: number
  varMonto: number
  varPct: number
  hcPlan: number
  justificacionDesvio: string
}

function hashStr(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

/** MOCK — "Centro de costo" no está modelado en `Servicio`; se deriva un código legible y estable por
 * servicio solo para poblar esta columna del "Detalle de línea (PEP)". Reemplazar por el campo real
 * cuando exista en el sistema de origen. */
function centroCostoMock(s: Servicio): string {
  const letras = (s.pais.slice(0, 1) + s.equipo.slice(0, 2)).toUpperCase()
  const digitos = String(1000000 + (hashStr(s.id) % 9000000))
  return `${letras}${digitos}`
}

/**
 * Una fila por fragmento de destino (igual que el resto de Consolidado): un servicio repartido entre
 * varios países aparece como varias líneas, cada una con su propio Origen/Destino/Moneda/Plan —
 * replicando el "Detalle de línea (PEP)" de la vista de referencia.
 */
export function buildServicioLineas(servicios: Servicio[], vista: CurrencyView, paisMoneda?: Pais | null): ServicioLineaRow[] {
  const rows: ServicioLineaRow[] = []
  for (const s of servicios) {
    fragmentsFor(s, vista, paisMoneda).forEach((frag, i) => {
      const varMonto = frag.plan - frag.fIPC
      rows.push({
        key: `${s.id}|${i}`,
        pepN4: s.pep,
        servicio: s.nombre,
        centroCosto: centroCostoMock(s),
        gerencia: s.gerencia,
        equipo: s.equipo,
        rubro: s.rubro,
        cuentaContable: s.cuentaContable,
        origen: s.pais,
        destino: frag.pais,
        moneda: vista === 'dolar' ? 'USD' : paisMonedaMap[frag.pais],
        plan: frag.plan,
        forecastIPC: frag.fIPC,
        varMonto,
        varPct: frag.fIPC ? (varMonto / frag.fIPC) * 100 : 0,
        hcPlan: 0,
        justificacionDesvio: justificacionDesvioDe(s),
      })
    })
  }
  return rows
}
