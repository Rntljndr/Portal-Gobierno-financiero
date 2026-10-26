import { Select } from '@/shared/ui'
import { EJERCICIO_ACTUAL, EJERCICIO_PLANIFICACION } from '@/data/peps'
import type { GerenciaCascada } from '../lib/gerencia-cascada'
import { Field } from './crear-pep-n4-campos'

interface GerenciaBloqueProps {
  anio: number
  cascada: GerenciaCascada
  gerenciaPadre: string
  gerencia: string
  equipo: string
  onChangeGerenciaPadre: (v: string) => void
  onChangeGerencia: (v: string) => void
  onChangeEquipo: (v: string) => void
}

/** F: "los campos podrían estar en un recuadro encerrado con el título de cada ejercicio, más que solo
 * el nombre del ejercicio en un tag" — recuadro con borde y el año como título de sección, no un badge
 * chico, tanto si hay uno como si hay dos bloques a la vez. */
function GerenciaBloque({ anio, cascada, gerenciaPadre, gerencia, equipo, onChangeGerenciaPadre, onChangeGerencia, onChangeEquipo }: GerenciaBloqueProps) {
  return (
    <div className="rounded-lg border border-border p-[14px]">
      <div className="mb-3 text-[13px] font-bold text-foreground">Ejercicio {anio}</div>
      <div className="grid grid-cols-3 gap-4">
        <Field text="Gerencia Padre" required>
          <Select value={gerenciaPadre} onChange={onChangeGerenciaPadre} options={cascada.gerenciaPadreOpciones} />
        </Field>
        <Field text="Gerencia" required>
          <Select value={gerencia} onChange={onChangeGerencia} options={cascada.gerenciaOpciones} disabled={!gerenciaPadre} placeholder={gerenciaPadre ? 'Seleccionar gerencia' : 'Selecciona una gerencia padre'} />
        </Field>
        <Field text="Equipo" required>
          <Select value={equipo} onChange={onChangeEquipo} options={cascada.equipoOpciones} disabled={!gerencia} placeholder={gerencia ? 'Seleccionar equipo' : 'Selecciona una gerencia'} />
        </Field>
      </div>
    </div>
  )
}

interface CrearPepN4GerenciaSectionProps {
  s: {
    form: { gerenciaActual: { gerenciaPadre: string; gerencia: string; equipo: string }; gerenciaPlanificacion: { gerenciaPadre: string; gerencia: string; equipo: string } }
    recurrente: boolean
    cascadaActual: GerenciaCascada
    cascadaPlanificacion: GerenciaCascada
    actual: { setGerenciaPadre: (v: string) => void; setGerencia: (v: string) => void; setEquipo: (v: string) => void }
    planificacion: { setGerenciaPadre: (v: string) => void; setGerencia: (v: string) => void; setEquipo: (v: string) => void }
  }
}

/** Gerencia Padre > Gerencia > Equipo, una vez por ejercicio en el que el PEP quede habilitado (F:
 * "en el caso de que el usuario seleccione la opción 2026 y dada la regla que este mismo PEP pasa para
 * el siguiente ejercicio, debemos asignar Gerencia Padre, Gerencia y equipo para cada año") — con el
 * ejercicio en curso (2026) se piden ambos bloques (2026 y 2027, el de continuación); con el de
 * planificación (2027) solo. */
export function CrearPepN4GerenciaSection({ s }: CrearPepN4GerenciaSectionProps) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {s.recurrente && (
        <GerenciaBloque
          anio={EJERCICIO_ACTUAL}
          cascada={s.cascadaActual}
          gerenciaPadre={s.form.gerenciaActual.gerenciaPadre}
          gerencia={s.form.gerenciaActual.gerencia}
          equipo={s.form.gerenciaActual.equipo}
          onChangeGerenciaPadre={s.actual.setGerenciaPadre}
          onChangeGerencia={s.actual.setGerencia}
          onChangeEquipo={s.actual.setEquipo}
        />
      )}
      <GerenciaBloque
        anio={EJERCICIO_PLANIFICACION}
        cascada={s.cascadaPlanificacion}
        gerenciaPadre={s.form.gerenciaPlanificacion.gerenciaPadre}
        gerencia={s.form.gerenciaPlanificacion.gerencia}
        equipo={s.form.gerenciaPlanificacion.equipo}
        onChangeGerenciaPadre={s.planificacion.setGerenciaPadre}
        onChangeGerencia={s.planificacion.setGerencia}
        onChangeEquipo={s.planificacion.setEquipo}
      />
    </div>
  )
}
