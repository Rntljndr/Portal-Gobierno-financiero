import { Button, Icon } from '@/shared/ui'

interface PepN4ActionsProps {
  onCargaMasiva: () => void
  onCrear: () => void
  onEdicionMasiva: () => void
  onDescargar: () => void
}

export function PepN4Actions({ onCargaMasiva, onCrear, onEdicionMasiva, onDescargar }: PepN4ActionsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2.5">
      <Button variant="outline" size="sm" onClick={onCargaMasiva}>
        <Icon name="upload" size={12} color="#0047B0" /> Crear PEP N4 masivamente
      </Button>
      <Button variant="onGreenCard" size="sm" onClick={onCrear} className="border-[#1F8A5B] bg-[#22976B] text-white hover:bg-[#1F8A5B]">
        <Icon name="plus" size={13} color="#fff" /> Crear PEP N4
      </Button>
      <Button variant="primary" size="sm" onClick={onEdicionMasiva}>
        <Icon name="edit" size={12} color="#fff" /> Edición masiva
      </Button>
      <Button variant="outline" size="sm" onClick={onDescargar}>
        <Icon name="download" size={12} color="#0047B0" /> Descargar
      </Button>
    </div>
  )
}
