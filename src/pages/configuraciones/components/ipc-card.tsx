import { paisesIpc, type IpcPorPais } from '@/data/configuraciones'
import { SettingsCard } from './settings-card'

interface IpcCardProps {
  ipc: IpcPorPais
  onChange: (pais: string, value: string) => void
}

export function IpcCard({ ipc, onChange }: IpcCardProps) {
  return (
    <SettingsCard icon="trendup" title="IPC por país">
      <div className="grid grid-cols-4 gap-3">
        {paisesIpc.map((pais) => (
          <div key={pais}>
            <label className="mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">IPC {pais}</label>
            <div className="relative">
              <input
                type="number"
                value={ipc[pais]}
                onChange={(e) => onChange(pais, e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-white px-2.5 pr-6 text-[13px] text-foreground outline-none focus:border-primary"
              />
              <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
          </div>
        ))}
      </div>
    </SettingsCard>
  )
}
