import { useMemo, useState } from 'react'
import { estructuraParaAnio } from '@/data/gerencias-equipos'
import { EJERCICIO_ACTUAL, EJERCICIO_PLANIFICACION, type PepN4Row } from '@/data/peps'
import { cascadaGerencia, gerenciaSeleccionCompleta, GERENCIA_SELECCION_VACIA, type GerenciaSeleccion } from './gerencia-cascada'

interface CrearPepN4Form {
  ejercicio: number
  nombre: string
  pais: string
  area: string
  cuenta: string
  bandera: string
  destino: string
  ceco: string
  /** Gerencia Padre/Gerencia/Equipo para el ejercicio en curso (2026) — solo aplica/se muestra si el
   * PEP se habilita desde ahí, ya que se arrastra como recurrente al de planificación. */
  gerenciaActual: GerenciaSeleccion
  /** Idem para el ejercicio de planificación (2027) — siempre requerida: es el único bloque cuando se
   * habilita directo en planificación, y el segundo bloque cuando se habilita desde el en curso (F:
   * "dada la regla que este mismo PEP pasa para el siguiente ejercicio, debemos asignar Gerencia Padre,
   * Gerencia y equipo para cada año"). */
  gerenciaPlanificacion: GerenciaSeleccion
  contratoDolares: boolean
}

const EMPTY_FORM: CrearPepN4Form = {
  ejercicio: EJERCICIO_ACTUAL,
  nombre: '',
  pais: '',
  area: '',
  cuenta: '',
  bandera: '',
  destino: '',
  ceco: '',
  gerenciaActual: GERENCIA_SELECCION_VACIA,
  gerenciaPlanificacion: GERENCIA_SELECCION_VACIA,
  contratoDolares: false,
}

type BloqueGerencia = 'gerenciaActual' | 'gerenciaPlanificacion'

/** Estado de "Crear PEP N4" (F: "debe tener el drawer que aparece en [el ABM de referencia]"). La
 * cascada Gerencia Padre > Gerencia > Equipo viene de `estructuraParaAnio` (Gerencias y Equipos) — con
 * un bloque independiente por ejercicio (ver `gerenciaActual`/`gerenciaPlanificacion`), porque la
 * estructura organizacional vigente puede diferir entre el ejercicio en curso y el de planificación. */
export function useCrearPepN4() {
  const [form, setForm] = useState<CrearPepN4Form>(EMPTY_FORM)

  const estructuraActual = useMemo(() => estructuraParaAnio(EJERCICIO_ACTUAL), [])
  const estructuraPlanificacion = useMemo(() => estructuraParaAnio(EJERCICIO_PLANIFICACION), [])
  const cascadaActual = useMemo(() => cascadaGerencia(estructuraActual, form.gerenciaActual), [estructuraActual, form.gerenciaActual])
  const cascadaPlanificacion = useMemo(() => cascadaGerencia(estructuraPlanificacion, form.gerenciaPlanificacion), [estructuraPlanificacion, form.gerenciaPlanificacion])

  const setEjercicio = (ejercicio: number) => setForm((f) => ({ ...f, ejercicio }))
  const setPais = (pais: string) => setForm((f) => ({ ...f, pais, area: '' }))
  const set = <K extends keyof CrearPepN4Form>(key: K, value: CrearPepN4Form[K]) => setForm((f) => ({ ...f, [key]: value }))

  const gerenciaSetters = (bloque: BloqueGerencia) => ({
    setGerenciaPadre: (gerenciaPadre: string) => setForm((f) => ({ ...f, [bloque]: { gerenciaPadre, gerencia: '', equipo: '' } })),
    setGerencia: (gerencia: string) => setForm((f) => ({ ...f, [bloque]: { ...f[bloque], gerencia, equipo: '' } })),
    setEquipo: (equipo: string) => setForm((f) => ({ ...f, [bloque]: { ...f[bloque], equipo } })),
  })

  const recurrente = form.ejercicio === EJERCICIO_ACTUAL
  const canSubmit = !!(
    form.nombre.trim() &&
    form.pais &&
    form.area &&
    form.cuenta &&
    form.bandera &&
    form.destino &&
    gerenciaSeleccionCompleta(form.gerenciaPlanificacion) &&
    (!recurrente || gerenciaSeleccionCompleta(form.gerenciaActual))
  )

  const reset = () => setForm(EMPTY_FORM)

  const buildRow = (): PepN4Row => {
    const seq = String(Date.now()).slice(-4)
    return {
      pep: `${form.pais.slice(0, 2).toUpperCase()}-N4-${seq}`,
      pais: form.pais,
      moneda: form.contratoDolares ? 'USD' : 'ARS',
      cod: seq,
      servicio: form.nombre,
      area: form.area,
      cuenta: form.cuenta,
      fechaCreacion: new Date().toISOString().slice(0, 10),
      ultimaEdicion: { fecha: new Date().toISOString().slice(0, 10), usuario: 'Andrea Morales' },
    }
  }

  return {
    form,
    recurrente,
    setEjercicio,
    setNombre: (v: string) => set('nombre', v),
    setPais,
    setArea: (v: string) => set('area', v),
    setCuenta: (v: string) => set('cuenta', v),
    setBandera: (v: string) => set('bandera', v),
    setDestino: (v: string) => set('destino', v),
    setCeco: (v: string) => set('ceco', v),
    setContratoDolares: (v: boolean) => set('contratoDolares', v),
    cascadaActual,
    cascadaPlanificacion,
    actual: gerenciaSetters('gerenciaActual'),
    planificacion: gerenciaSetters('gerenciaPlanificacion'),
    canSubmit,
    reset,
    buildRow,
  }
}
