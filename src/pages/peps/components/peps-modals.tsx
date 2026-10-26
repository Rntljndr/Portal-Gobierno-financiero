import { BulkUploadDrawer } from '@/shared/ui'
import { HabilitarPepsDrawer } from './habilitar-peps-drawer'

export type OpenPepModal = null | 'crearN4Masivo' | 'crearN7Masivo' | 'editarEquipo' | 'asignarCecos' | 'habilitarPeps'

interface PepsModalsProps {
  openModal: OpenPepModal
  onClose: () => void
  onApplied: (count: number) => void
}

const CONFIG: Record<Exclude<NonNullable<OpenPepModal>, 'habilitarPeps'>, { title: string; subtitle: string; applyLabel: string; infoNote?: string; templateHeaders: string[] }> = {
  crearN4Masivo: {
    title: 'Crear PEP N4 masivamente',
    subtitle: 'Sube un archivo .xlsx con los PEP N4 a crear.',
    applyLabel: 'Aplicar carga masiva',
    templateHeaders: ['País', 'Área', 'Servicio', 'Cuenta Contable', 'Gerencia Padre', 'Gerencia', 'Equipo'],
  },
  crearN7Masivo: {
    title: 'Crear PEP N7 masivamente',
    subtitle: 'Sube un archivo .xlsx con los PEP N7 a crear.',
    applyLabel: 'Aplicar carga masiva',
    infoNote: 'Cada PEP N7 se crea en los ejercicios abiertos donde su PEP N4 tenga presupuesto. Si el PEP N4 solo existe en el ejercicio en planificación, el PEP N7 se crea solo ahí.',
    templateHeaders: ['PEP N4', 'Bandera', 'Destino', 'Centro de Costo'],
  },
  editarEquipo: {
    title: 'Editar equipo',
    subtitle: 'Sube un archivo .xlsx para actualizar la asignación de equipo. Debe contener los encabezados: PEP N4, Gerencia padre, Gerencia hijo, Equipo.',
    applyLabel: 'Aplicar cambios',
    templateHeaders: ['PEP N4', 'Gerencia padre', 'Gerencia hijo', 'Equipo'],
  },
  asignarCecos: {
    title: 'Asignar CeCos',
    subtitle: 'Sube un archivo .xlsx para asignar centros de costo a PEP N7 que no tengan uno. Debe contener los encabezados: Código PEP N7, Centro de costo.',
    applyLabel: 'Aplicar asignación',
    templateHeaders: ['Código PEP N7', 'Centro de costo'],
  },
}

function downloadTemplate(filename: string, headers: string[]) {
  const blob = new Blob([`${headers.join(';')}\n`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function PepsModals({ openModal, onClose, onApplied }: PepsModalsProps) {
  if (openModal === 'habilitarPeps') {
    return <HabilitarPepsDrawer open onClose={onClose} onApplied={onApplied} />
  }

  const config = openModal ? CONFIG[openModal] : null

  return (
    <BulkUploadDrawer
      open={openModal !== null}
      onClose={onClose}
      title={config?.title ?? ''}
      subtitle={config?.subtitle}
      infoNote={config?.infoNote}
      applyLabel={config?.applyLabel ?? ''}
      accept=".csv,.xlsx"
      hint="Formatos aceptados: .csv, .xlsx"
      onDownloadTemplate={config ? () => downloadTemplate(`${openModal}-template.csv`, config.templateHeaders) : undefined}
      onApplied={onApplied}
    />
  )
}
