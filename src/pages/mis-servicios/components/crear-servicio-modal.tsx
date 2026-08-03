import { useState } from 'react'
import { Drawer, Button } from '@/shared/ui'
import type { Servicio } from '@/data/services'
import { EMPTY_DRAFT, isDraftValid, type CrearServicioDraft } from '../lib/crear-servicio-draft'
import { CrearServicioForm } from './crear-servicio-form'

interface CrearServicioModalProps {
  open: boolean
  onClose: () => void
  onCreated: (servicio: Servicio) => void
}

function buildServicio(draft: CrearServicioDraft): Servicio {
  const seq = String(Math.floor(Math.random() * 900) + 100)
  return {
    id: `SVC-${seq}`,
    nombre: draft.nombre.trim(),
    codigo: `SVC${seq}`,
    pais: draft.pais as Servicio['pais'],
    equipo: draft.equipo,
    moneda: draft.contratoUsd ? 'USD' : 'CLP',
    pep: `PEP-2027-${seq}`,
    estado: 'Borrador',
    rubro: 'Servicios',
    division: 'Corporativo',
    bandera: draft.bandera,
    gerenciaPadre: draft.gerenciaPadre,
    gerencia: draft.gerencia,
    cuentaContable: draft.cuentaContable,
    contrato: `CTR-2027-${seq}`,
    totalPlan: 0,
    forecastBase: 0,
    forecastIPC: 0,
    tipoOrigen: (draft.tipoOrigen || 'Nuevo') as Servicio['tipoOrigen'],
    ultimaEdicion: new Date().toISOString().slice(0, 10),
  }
}

export function CrearServicioModal({ open, onClose, onCreated }: CrearServicioModalProps) {
  const [draft, setDraft] = useState<CrearServicioDraft>(EMPTY_DRAFT)
  const valid = isDraftValid(draft)

  const handleClose = () => {
    setDraft(EMPTY_DRAFT)
    onClose()
  }

  const handleCrear = () => {
    if (!valid) return
    onCreated(buildServicio(draft))
    setDraft(EMPTY_DRAFT)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Crear PEP N4"
      wide
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCrear} disabled={!valid} className="disabled:opacity-50">
            Crear PEP
          </Button>
        </>
      }
    >
      <CrearServicioForm draft={draft} onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))} />
      <div className="mt-4 text-xs text-muted-foreground">* Los campos marcados con asterisco son obligatorios.</div>
    </Drawer>
  )
}
