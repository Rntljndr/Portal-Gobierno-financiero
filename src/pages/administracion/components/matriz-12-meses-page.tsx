import { useState } from 'react'
import { Breadcrumb, Button, Icon, PageHeader, Select, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { Matriz12MesesTable, type CellValue } from './matriz-12-meses-table'

interface Matriz12MesesPageProps {
  title: string
  subtitle: string
  note: string
  ejercicio: number
  ejercicios: number[]
  onChangeEjercicio: (anio: number) => void
  /** Filas en el orden a mostrar: país -> 12 valores (number para tasas, string ISO o null para fechas). */
  data: Record<string, CellValue[]>
  cellType: 'number' | 'date'
  onSaveFila: (pais: string, meses: CellValue[]) => void
  showMoneda?: (pais: string) => string | undefined
}

export function Matriz12MesesPage({ title, subtitle, note, ejercicio, ejercicios, onChangeEjercicio, data, cellType, onSaveFila, showMoneda }: Matriz12MesesPageProps) {
  const { message, showToast } = useToast()
  const [editingPais, setEditingPais] = useState<string | null>(null)
  const [draft, setDraft] = useState<CellValue[]>([])

  const paisesOrdenados = Object.keys(data).sort((a, b) => a.localeCompare(b, 'es'))

  const startEdit = (pais: string) => {
    setEditingPais(pais)
    setDraft([...data[pais]])
  }

  const confirmEdit = () => {
    if (!editingPais) return
    onSaveFila(editingPais, draft)
    setEditingPais(null)
    showToast('Registro actualizado correctamente.')
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: title }]} />
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex items-end gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Ejercicio</label>
              <Select value={String(ejercicio)} onChange={(v) => onChangeEjercicio(Number(v))} options={ejercicios.map((e) => String(e))} className="w-[120px]" />
            </div>
            <Button variant="outline" size="default">
              <Icon name="upload" size={13} color="#0047B0" /> Importar
            </Button>
            <Button variant="outline" size="default" onClick={() => showToast('Exportación generada correctamente.')}>
              <Icon name="download" size={13} color="#0047B0" /> Exportar
            </Button>
          </div>
        }
      />

      <div className="mx-8 mb-2 text-[12.5px] text-muted-foreground">{note}</div>

      <Matriz12MesesTable
        paises={paisesOrdenados}
        data={data}
        cellType={cellType}
        showMoneda={showMoneda}
        editingPais={editingPais}
        draft={draft}
        onChangeDraft={(i, v) => {
          const next = [...draft]
          next[i] = v
          setDraft(next)
        }}
        onStartEdit={startEdit}
        onCancelEdit={() => setEditingPais(null)}
        onConfirmEdit={confirmEdit}
      />

      <Toast message={message} />
    </div>
  )
}
