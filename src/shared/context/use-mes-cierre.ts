import { useContext } from 'react'
import { MesCierreContext } from './mes-cierre-context'

export function useMesCierre() {
  const ctx = useContext(MesCierreContext)
  if (!ctx) throw new Error('useMesCierre must be used within MesCierreProvider')
  return ctx
}
