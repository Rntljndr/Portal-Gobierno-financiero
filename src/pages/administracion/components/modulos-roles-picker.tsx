import { Icon, Select } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { moduloOpciones, rolOpciones, type UsuarioModulo, type UsuarioRol } from '@/data/administracion-usuarios'
import { AdministracionToggle } from './administracion-toggle'

const moduloIcon: Record<UsuarioModulo, 'config' | 'lock'> = { SIP: 'config', PMO: 'config', Seguridad: 'lock' }

interface ModulosRolesPickerProps {
  roles: UsuarioRol[]
  onChange: (roles: UsuarioRol[]) => void
}

export function ModulosRolesPicker({ roles, onChange }: ModulosRolesPickerProps) {
  const toggleModulo = (modulo: UsuarioModulo) => {
    const tieneModulo = roles.some((r) => r.modulo === modulo)
    onChange(tieneModulo ? roles.filter((r) => r.modulo !== modulo) : [...roles, { modulo, rol: rolOpciones[0] }])
  }

  const setRolDeModulo = (modulo: UsuarioModulo, rol: string) => onChange(roles.map((r) => (r.modulo === modulo ? { ...r, rol } : r)))

  return (
    <div>
      <div className="mb-1 text-[12px] font-semibold text-cs-gris-oscuro">Selección de módulos y roles *</div>
      <div className="mb-2 text-[11px] text-muted-foreground">Selecciona a qué módulos tendrá acceso este usuario, y el rol dentro de cada uno</div>
      <div className="flex flex-col gap-2.5">
        {moduloOpciones.map((modulo) => {
          const rolAsignado = roles.find((r) => r.modulo === modulo)
          return (
            <div key={modulo} className={cn('rounded-lg border p-3', rolAsignado ? 'border-primary bg-primary/5' : 'border-border')}>
              <button type="button" onClick={() => toggleModulo(modulo)} className="flex w-full items-center gap-2.5 text-left">
                <Icon name={moduloIcon[modulo]} size={16} color={rolAsignado ? '#0047B0' : '#8A90A2'} />
                <span className={cn('flex-1 text-[13px] font-semibold', rolAsignado ? 'text-primary' : 'text-foreground')}>{modulo}</span>
                <AdministracionToggle checked={Boolean(rolAsignado)} onChange={() => toggleModulo(modulo)} label={`Módulo ${modulo}`} />
              </button>
              {rolAsignado && (
                <div className="mt-2.5 w-[220px]">
                  <Select value={rolAsignado.rol} onChange={(v) => setRolDeModulo(modulo, v)} options={rolOpciones} />
                </div>
              )}
            </div>
          )
        })}
        {roles.length === 0 && <div className="text-[11.5px] text-destructive">Selecciona al menos un módulo</div>}
      </div>
    </div>
  )
}
