import { Button, Icon } from '@/shared/ui'

export function SendBar({ selectedCount, onSend }: { selectedCount: number; onSend: () => void }) {
  return (
    <div className="flex justify-end border-t border-border bg-white px-8 py-3.5">
      <Button variant="primary" disabled={selectedCount === 0} onClick={onSend} className="disabled:opacity-50">
        <Icon name="send" size={13} color="#fff" /> Enviar a Control de Gestión{selectedCount > 0 ? ` (${selectedCount})` : ''}
      </Button>
    </div>
  )
}
