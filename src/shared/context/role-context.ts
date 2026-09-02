import { createContext } from 'react'

export type UserRole = 'cdg' | 'responsable'

export const ROLE_LABELS: Record<UserRole, string> = {
  cdg: 'Control de Gestión',
  responsable: 'Responsable de Servicios',
}

export interface RoleStore {
  role: UserRole
  setRole: (role: UserRole) => void
}

export const RoleContext = createContext<RoleStore | null>(null)
