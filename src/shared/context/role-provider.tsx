import { useState, type ReactNode } from 'react'
import { RoleContext, type UserRole } from './role-context'

const STORAGE_KEY = 'app_user_role_v1'

function loadRole(): UserRole {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === 'cdg' || raw === 'responsable' ? raw : 'cdg'
  } catch {
    return 'cdg'
  }
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(loadRole)

  const setRole = (next: UserRole) => {
    setRoleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage no disponible — el rol simplemente no persiste entre sesiones
    }
  }

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}
