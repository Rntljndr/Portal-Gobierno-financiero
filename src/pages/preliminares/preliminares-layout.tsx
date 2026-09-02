import { Outlet } from 'react-router'
import { PreliminaresProvider } from './lib/preliminares-store'

export function PreliminaresLayout() {
  return (
    <PreliminaresProvider>
      <Outlet />
    </PreliminaresProvider>
  )
}
