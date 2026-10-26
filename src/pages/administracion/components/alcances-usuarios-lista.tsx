import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { UsuarioSip } from '@/data/usuarios-sip'

interface AlcancesUsuariosListaProps {
  usuarios: UsuarioSip[]
  usuarioId: string | null
  onSelect: (id: string) => void
  buscar: string
  onBuscar: (v: string) => void
}

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AlcancesUsuariosLista({ usuarios, usuarioId, onSelect, buscar, onBuscar }: AlcancesUsuariosListaProps) {
  return (
    <div className="w-[300px] shrink-0 rounded-xl border border-border bg-white">
      <div className="p-3">
        <div className="mb-2 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Seleccionar usuario</div>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-border px-3">
          <Icon name="search" size={13} color="#8A90A2" />
          <input
            value={buscar}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder="Buscar usuario..."
            className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="max-h-[520px] overflow-y-auto border-t border-border">
        {usuarios.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => onSelect(u.id)}
            className={cn('flex w-full items-center gap-2.5 border-b border-[#F8F9FD] p-[10px_14px] text-left hover:bg-surface-hover', u.id === usuarioId && 'bg-primary/5')}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EEF1FB] text-[11px] font-bold text-primary">{iniciales(u.nombre)}</span>
            <span className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-foreground">{u.nombre}</div>
              <div className="text-[11px] text-muted-foreground">{u.rol}</div>
            </span>
            {u.id === usuarioId && <Icon name="check" size={13} color="#0047B0" />}
          </button>
        ))}
      </div>
    </div>
  )
}
