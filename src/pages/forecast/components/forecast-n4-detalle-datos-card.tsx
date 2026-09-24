import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { DataField } from '@/pages/servicio-detalle/components/data-field'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import type { ForecastIdentidadBase } from '../lib/forecast-identidad'
import { formatFechaCorta } from '../lib/format-date'

interface ForecastN4DetalleDatosCardProps {
  round: ForecastRound
  n4: ForecastN4Linea
  identidad: ForecastIdentidadBase
}

/** Ficha de identidad del PEP N4 (F: "como Datos del servicio") — mismo acordeón que
 * ForecastN7DetalleDatosCard/ForecastDatosCard/DataAccordion. Sin Llave de Distribución: esa columna
 * es propia de cada PEP N7 hijo (cómo se reparte el total del N4), no del N4 en sí. */
export function ForecastN4DetalleDatosCard({ round, n4, identidad }: ForecastN4DetalleDatosCardProps) {
  const [open, setOpen] = useState(true)
  const isManual = n4.n7.some((l) => l.tipoActualizacion === 'manual')

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-[16px_20px] text-left">
        <span className="text-[15px] font-bold text-primary">Datos del PEP N4</span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>

      {open && (
        <div className="p-[0_20px_20px]">
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="Pep" value={n4.n4Codigo} />
            <DataField label="País" value={identidad.pais} />
            <DataField label="Estado" value={identidad.estado} />
          </div>
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="Área" value={identidad.gerencia} />
            <DataField label="Servicio" value={n4.n4Nombre} />
            <DataField label="Gerencia - Equipo" value={`${identidad.gerenciaPadre} - ${identidad.equipo}`} />
          </div>
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="Cuenta Contable" value={identidad.cuentaContable} />
            <DataField label="Período" value={`${round.titulo} (${formatFechaCorta(round.fechaInicio)} al ${formatFechaCorta(round.fechaTermino)})`} />
            <DataField label="Usuario Última Edición" value={isManual ? 'Andrea Morales' : '—'} />
          </div>
        </div>
      )}
    </div>
  )
}
