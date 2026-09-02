import { useContext } from 'react'
import { PreliminaresContext } from './preliminares-context'

export function usePreliminaresStore() {
  const ctx = useContext(PreliminaresContext)
  if (!ctx) throw new Error('usePreliminaresStore must be used within PreliminaresProvider')
  return ctx
}
