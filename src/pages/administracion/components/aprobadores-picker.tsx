import { Badge, Button, Icon, Select } from '@/shared/ui'
import { usuariosCatalogo } from '@/data/administracion-usuarios'
import type { TipoSolicitudAprobador } from '@/data/administracion-reglas'

const aprobadorOpciones = usuariosCatalogo.map((u) => ({ value: u.email, label: `${u.nombre} ${u.apellido}` }))

function initials(nombre: string) {
  return nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface AprobadoresPickerProps {
  aprobadores: TipoSolicitudAprobador[]
  onChange: (aprobadores: TipoSolicitudAprobador[]) => void
  nuevoAprobador: string
  onChangeNuevoAprobador: (v: string) => void
}

export function AprobadoresPicker({ aprobadores, onChange, nuevoAprobador, onChangeNuevoAprobador }: AprobadoresPickerProps) {
  const addAprobador = () => {
    if (!nuevoAprobador) return
    const usuario = usuariosCatalogo.find((u) => u.email === nuevoAprobador)
    if (!usuario || aprobadores.some((a) => a.email === usuario.email)) return
    onChange([...aprobadores, { nombre: `${usuario.nombre} ${usuario.apellido}`, email: usuario.email }])
    onChangeNuevoAprobador('')
  }

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Aprobadores</label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Select value={nuevoAprobador} onChange={onChangeNuevoAprobador} options={aprobadorOpciones.map((o) => o.value)} placeholder="Buscar aprobador..." />
        </div>
        <Button variant="outline" onClick={addAprobador}>
          Agregar
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {aprobadores.map((a, i) => (
          <div key={a.email} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{initials(a.nombre)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground">
                {a.nombre}
                <Badge variant="neutral" className="text-[9px]">
                  N°{i + 1}
                </Badge>
              </div>
              <div className="truncate text-[11px] text-muted-foreground">{a.email}</div>
            </div>
            <button
              type="button"
              onClick={() => onChange(aprobadores.filter((x) => x.email !== a.email))}
              aria-label="Quitar aprobador"
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover"
            >
              <Icon name="x_close" size={12} color="currentColor" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
