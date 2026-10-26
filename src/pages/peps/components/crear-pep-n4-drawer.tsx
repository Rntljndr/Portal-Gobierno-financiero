import { Button, Drawer } from '@/shared/ui'
import type { PepN4Row } from '@/data/peps'
import { useCrearPepN4 } from '../lib/use-crear-pep-n4'
import { CrearPepN4EjercicioSection } from './crear-pep-n4-ejercicio-section'
import { CrearPepN4Campos, CrearPepN4ContratoDolares, Field } from './crear-pep-n4-campos'
import { CrearPepN4GerenciaSection } from './crear-pep-n4-gerencia-section'

interface CrearPepN4DrawerProps {
  open: boolean
  onClose: () => void
  onCreated: (row: PepN4Row) => void
}

/** "Crear PEP N4" (F: "debe tener el drawer que aparece en [el ABM de referencia]") — mismas secciones
 * que el drawer de referencia: Ejercicio de habilitación + línea de tiempo, Nombre del servicio,
 * País/Área/Cuenta Contable, Bandera/Destino/Centro de Costos, y la cascada Gerencia Padre > Gerencia >
 * Equipo tomada de Gerencias y Equipos (ver useCrearPepN4) — Centro de Costos es el único campo
 * opcional, igual que en la referencia. F: "si se selecciona 2026 [ejercicio en curso], dada la regla
 * de que el PEP pasa al siguiente ejercicio, debemos asignar Gerencia Padre/Gerencia/Equipo para cada
 * año" — CrearPepN4GerenciaSection pide un bloque por 2026 y otro por 2027 en ese caso; con 2027 solo
 * pide el de planificación. */
export function CrearPepN4Drawer({ open, onClose, onCreated }: CrearPepN4DrawerProps) {
  const s = useCrearPepN4()

  const close = () => {
    s.reset()
    onClose()
  }

  const submit = () => {
    if (!s.canSubmit) return
    onCreated(s.buildRow())
    close()
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      eyebrow="ABM PEPS · NUEVO PEP N4"
      title="Crear PEP N4"
      wide
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!s.canSubmit} className="disabled:opacity-50" onClick={submit}>
            Crear PEP
          </Button>
        </>
      }
    >
      <CrearPepN4EjercicioSection ejercicio={s.form.ejercicio} onChange={s.setEjercicio} />

      <div className="mb-5">
        <Field text="Nombre del servicio" required>
          <input
            value={s.form.nombre}
            onChange={(e) => s.setNombre(e.target.value)}
            placeholder="Ej: HP - Consultoría SAP Chile"
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] text-foreground outline-none focus:border-primary"
          />
        </Field>
      </div>

      <CrearPepN4Campos s={s} />
      <CrearPepN4GerenciaSection s={s} />
      <CrearPepN4ContratoDolares s={s} />
    </Drawer>
  )
}
