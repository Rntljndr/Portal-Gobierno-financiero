import type { ReactNode } from 'react'
import { Select } from '@/shared/ui'
import { banderaPaisOpciones, cecoOpciones, crearPepAreaOpciones, crearPepPaisOpciones, cuentaContableOpciones, destinoOpciones } from '@/data/peps'
import type { useCrearPepN4 } from '../lib/use-crear-pep-n4'

const label = 'mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro'

function Field({ children, text, required }: { children: ReactNode; text: string; required?: boolean }) {
  return (
    <div>
      <label className={label}>
        {text} {required && <span className="text-[#DC2626]">*</span>}
      </label>
      {children}
    </div>
  )
}

/** Campos País/Área/Cuenta Contable, Bandera/Destino/Centro de Costos y "Contrato en dólares" —
 * extraído de CrearPepN4Drawer para mantenerlo bajo el límite de líneas del linter. La cascada
 * Gerencia Padre > Gerencia > Equipo vive aparte en CrearPepN4GerenciaSection, porque puede repetirse
 * una vez por ejercicio (ver useCrearPepN4). */
export function CrearPepN4Campos({ s }: { s: ReturnType<typeof useCrearPepN4> }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Field text="País" required>
          <Select value={s.form.pais} onChange={s.setPais} options={crearPepPaisOpciones} />
        </Field>
        <Field text="Área" required>
          <Select value={s.form.area} onChange={s.setArea} options={crearPepAreaOpciones} disabled={!s.form.pais} placeholder={s.form.pais ? 'Seleccionar área' : 'Selecciona un país primero'} />
        </Field>
        <Field text="Cuenta Contable" required>
          <Select value={s.form.cuenta} onChange={s.setCuenta} options={cuentaContableOpciones} />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Field text="Bandera" required>
          <Select value={s.form.bandera} onChange={s.setBandera} options={banderaPaisOpciones.map((b) => `${b.emoji} ${b.label}`)} />
        </Field>
        <Field text="Destino" required>
          <Select value={s.form.destino} onChange={s.setDestino} options={destinoOpciones} />
        </Field>
        <Field text="Centro de Costos">
          <Select value={s.form.ceco} onChange={s.setCeco} options={cecoOpciones} />
        </Field>
      </div>
    </>
  )
}

export function CrearPepN4ContratoDolares({ s }: { s: ReturnType<typeof useCrearPepN4> }) {
  return (
    <label className="mt-5 flex items-start gap-2.5">
      <input type="checkbox" checked={s.form.contratoDolares} onChange={(e) => s.setContratoDolares(e.target.checked)} className="mt-0.5 size-4 accent-primary" />
      <span>
        <span className="block text-[13px] font-medium text-foreground">Contrato en dólares</span>
        <span className="block text-[11.5px] text-muted-foreground">El servicio será planificado y gestionado en USD.</span>
      </span>
    </label>
  )
}

export { Field }
