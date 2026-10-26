import { createContext, useContext } from 'react'
import type { V3Linea } from '@/data/gasto-it-v3'
import type { Moneda, VistaMoneda } from './moneda'
import type { GrupoRubro, Periodo } from './medida'
import type { Alcance, Rol } from './perimetro'
import type { DimId } from './pivot'

export interface Ajustes {
  tolerancia: number
  /** Punto abierto: si los perfiles IT también ven "Peso sobre la venta". */
  pesoParaIT: boolean
  /** Punto abierto: orden del ranking por desvío en monto o en %. */
  rankingOrden: 'monto' | 'pct'
}

export interface ReporteCtx {
  rol: Rol
  alcance: Alcance
  alcanceLabel: string
  /** Líneas de la selección (visión + país): alimentan las tarjetas de período y el resumen por rubro. */
  lineas: V3Linea[]
  /** Líneas de la selección acotadas además por el rubro elegido: todo lo que está bajo el resumen por rubro. */
  lineasAbajo: V3Linea[]
  /** Parámetro de lectura (Mes / Acumulado / Proyectado), elegido en las tarjetas superiores. */
  periodo: Periodo
  setPeriodo: (p: Periodo) => void
  grupoRubro: GrupoRubro | null
  setGrupoRubro: (g: GrupoRubro | null) => void
  /** Cambia el país seleccionado (desde la vista rápida por país). */
  setPais: (p: string) => void
  ajustes: Ajustes
  vistaMoneda: VistaMoneda
  /** Moneda en que se muestran todos los montos (USD, o la moneda local si hay un país seleccionado). */
  moneda: Moneda
  /** Navegación progresiva: lleva al detalle filtrado por `ruta`. */
  profundizar: (ruta: Partial<Record<DimId, string>>) => void
}

export const ReporteContext = createContext<ReporteCtx | null>(null)

export function useReporte(): ReporteCtx {
  const ctx = useContext(ReporteContext)
  if (!ctx) throw new Error('useReporte fuera de ReporteContext')
  return ctx
}
