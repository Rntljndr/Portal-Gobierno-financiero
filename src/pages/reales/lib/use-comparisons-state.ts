import { useContext } from 'react'
import { RealesComparisonsContext } from './reales-comparisons-context'

/** Estado de comparaciones compartido por las 3 pantallas de Reales (N4, N7, SubPEP) vía RealesComparisonsProvider (Ajuste R2). */
export function useComparisonsState() {
  const ctx = useContext(RealesComparisonsContext)
  if (!ctx) throw new Error('useComparisonsState must be used within RealesComparisonsProvider')
  return ctx
}
