import { cn } from '@/shared/lib/utils'
import { PepSelectionTable } from './pep-selection-table'

interface PepSelectionSectionProps {
  selPeps: Set<string>
  onTogglePep: (codigo: string) => void
  error?: string
}

export function PepSelectionSection({ selPeps, onTogglePep, error }: PepSelectionSectionProps) {
  return (
    <div className="mt-1 mb-4 border-t border-border pt-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[13px] font-bold text-foreground">Selección de PEPs</div>
        <div className={cn('rounded-full border px-3 py-1 text-xs font-bold', selPeps.size > 0 ? 'border-[#C7DEFF] bg-[#EEF4FF] text-primary' : 'border-border bg-[#F4F6FB] text-muted-foreground')}>
          {selPeps.size} PEP{selPeps.size !== 1 ? 's' : ''} seleccionado{selPeps.size !== 1 ? 's' : ''}
        </div>
      </div>
      <p className="mb-2.5 text-[11.5px] text-muted-foreground">Seleccioná los PEPs que tendrán permiso de edición en este forecast. Todos los PEPs seguirán siendo visibles.</p>
      <PepSelectionTable selected={selPeps} onToggle={onTogglePep} />
      {error && <div className="mt-3 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] p-[10px_14px] text-xs text-[#B45309]">{error}</div>}
    </div>
  )
}
