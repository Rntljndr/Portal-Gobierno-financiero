import { createContext } from 'react'

export interface MesCierreStore {
  mesCerrado: boolean
  cerrarMes: () => void
}

export const MesCierreContext = createContext<MesCierreStore | null>(null)
