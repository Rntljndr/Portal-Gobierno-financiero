import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { PreliminarN4Row } from '@/data/preliminares'
import type { PrelimFilters } from './preliminares-filters-types'

export interface PreliminaresStore {
  rows: PreliminarN4Row[]
  markDefinitivo: (n7Codigos: string[]) => void
  applyBulkUpload: (count: number) => void
  tab: 'n4' | 'n7'
  setTab: (t: 'n4' | 'n7') => void
  filters: PrelimFilters
  onChangeFilter: <K extends keyof PrelimFilters>(key: K, value: PrelimFilters[K]) => void
  clearFilters: () => void
  filtersOpen: boolean
  setFiltersOpen: Dispatch<SetStateAction<boolean>>
  /** Ajuste P3: mes abierto actual de Preliminares, avanza manualmente al ejecutar Cierre Contable. */
  mesAbierto: string
  mesAnterior: string
  ejecutarCierreContable: () => void
}

export const PreliminaresContext = createContext<PreliminaresStore | null>(null)
