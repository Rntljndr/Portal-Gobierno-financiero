import { useState, type ReactNode } from 'react'
import { MesCierreContext, type MesCierreStore } from './mes-cierre-context'

export function MesCierreProvider({ children }: { children: ReactNode }) {
  const [mesCerrado, setMesCerrado] = useState(false)
  const store: MesCierreStore = { mesCerrado, cerrarMes: () => setMesCerrado(true) }
  return <MesCierreContext.Provider value={store}>{children}</MesCierreContext.Provider>
}
