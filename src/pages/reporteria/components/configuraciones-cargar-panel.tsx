import { Icon } from '@/shared/ui'
import type { SavedConfig, SavedConfigData } from '../lib/saved-configs'

function formatFecha(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface ConfiguracionesCargarPanelProps {
  savedConfigs: SavedConfig[]
  onLoad: (data: SavedConfigData) => void
  onDelete: (name: string) => void
}

export function ConfiguracionesCargarPanel({ savedConfigs, onLoad, onDelete }: ConfiguracionesCargarPanelProps) {
  return (
    <div className="max-h-80 min-w-[280px] overflow-y-auto p-3">
      <div className="mb-2 text-xs font-semibold text-foreground">Configuraciones guardadas</div>
      {savedConfigs.length === 0 ? (
        <div className="p-[8px_0] text-xs text-muted-foreground">No hay configuraciones guardadas.</div>
      ) : (
        savedConfigs.map((cfg) => (
          <div key={cfg.name} className="flex items-center gap-1.5 border-b border-border p-[10px_2px] last:border-b-0">
            <button type="button" onClick={() => onLoad(cfg.data)} className="min-w-0 flex-1 text-left">
              <div className="truncate text-[13px] font-semibold text-foreground">{cfg.name}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{formatFecha(cfg.ts)}</div>
            </button>
            <button type="button" onClick={() => onDelete(cfg.name)} className="rounded p-1 text-[#B42318] hover:bg-[#FEE8E8]">
              <Icon name="trash" size={14} color="currentColor" />
            </button>
          </div>
        ))
      )}
    </div>
  )
}
