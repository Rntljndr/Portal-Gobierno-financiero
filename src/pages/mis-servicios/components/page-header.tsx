import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Breadcrumb, Icon } from '@/shared/ui'

interface MisServiciosHeaderProps {
  breadcrumb?: { label: string; to?: string }[]
  titulo?: string
  subtitulo?: string
  /** Acción a la derecha; por defecto, Configuraciones del ejercicio en planificación. */
  accion?: ReactNode
}

const BREADCRUMB = [
  { label: 'SIP', to: '/' },
  { label: 'Presupuesto', to: '/ejercicios' },
  { label: 'Ejercicios', to: '/ejercicios' },
  { label: 'Mis Servicios' },
]

/** Encabezado de las vistas de ejercicio (planificación por defecto; el ejercicio en curso pasa sus textos). */
export function MisServiciosHeader({
  breadcrumb = BREADCRUMB,
  titulo = 'Mis líneas presupuestarias · 2027',
  subtitulo = 'Revisa y ajusta los servicios bajo tu responsabilidad antes de enviar a Control de Gestión',
  accion,
}: MisServiciosHeaderProps = {}) {
  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <div className="flex items-center justify-between p-[10px_32px_20px]">
        <div>
          <div className="text-[26px] leading-tight font-bold tracking-tight text-primary">{titulo}</div>
          <div className="mt-1 text-[13px] text-muted-foreground">{subtitulo}</div>
        </div>
        {accion ?? (
        <Link
          to="/ejercicios/mis-servicios/configuraciones"
          className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro hover:border-border-strong"
        >
          <Icon name="config" size={14} color="currentColor" /> Configuraciones
        </Link>
        )}
      </div>
    </>
  )
}
