import { Button, Icon, Select } from '@/shared/ui'

interface IngresosToolbarProps {
  ejercicio: number
  ejercicios: number[]
  onChangeEjercicio: (v: number) => void
  onAgregar: () => void
  onImportar: () => void
  onDescargar: () => void
}

export function IngresosToolbar({ ejercicio, ejercicios, onChangeEjercicio, onAgregar, onImportar, onDescargar }: IngresosToolbarProps) {
  return (
    <div className="mx-8 mb-4 flex flex-wrap items-end justify-end gap-3">
      <div>
        <label className="mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Ejercicio</label>
        <Select value={String(ejercicio)} onChange={(v) => onChangeEjercicio(Number(v))} options={ejercicios.map((e) => String(e))} className="w-[120px]" />
      </div>
      <Button variant="primary" size="default" onClick={onAgregar}>
        <Icon name="plus" size={13} color="#fff" /> Agregar
      </Button>
      <Button variant="outline" size="default" onClick={onImportar}>
        <Icon name="upload" size={13} color="#0047B0" /> Importar
      </Button>
      <Button variant="outline" size="default" onClick={onDescargar}>
        <Icon name="download" size={13} color="#0047B0" /> Descargar
      </Button>
    </div>
  )
}
