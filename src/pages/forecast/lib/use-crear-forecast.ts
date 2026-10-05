import { useMemo, useState } from 'react'
import { buildDefaultTasas, type ForecastRound, type ForecastTipo } from '@/data/forecast'
import { n4CodesForEquipos } from './forecast-equipos'
import { equiposDisponiblesParaGerencias, n4CodesForGerencias } from './forecast-gerencias'
import { forecastNombreSugerido } from './forecast-nombre'

export interface CrearForecastForm {
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaTermino: string
  /** A3: hora (HH:mm) de inicio/cierre del periodo de edición, junto a su fecha correspondiente. */
  horaInicio: string
  horaTermino: string
  desvio: string
  tipo: ForecastTipo
  notificar: boolean
}

const EMPTY_FORM: CrearForecastForm = { titulo: '', descripcion: '', fechaInicio: '', fechaTermino: '', horaInicio: '09:00', horaTermino: '18:00', desvio: '', tipo: 'global', notificar: false }

export type FormErrors = Partial<Record<'titulo' | 'fechaInicio' | 'fechaTermino' | 'desvio' | 'equipos', string>>

function validate(f: CrearForecastForm): FormErrors {
  const errors: FormErrors = {}
  const today = new Date().toISOString().slice(0, 10)
  if (!f.titulo.trim()) errors.titulo = 'El título es requerido'
  else if (f.titulo.length > 100) errors.titulo = 'Máximo 100 caracteres'
  if (!f.fechaInicio) errors.fechaInicio = 'La fecha de inicio es requerida'
  else if (f.fechaInicio < today) errors.fechaInicio = 'La fecha debe ser igual o posterior a hoy'
  if (!f.fechaTermino) errors.fechaTermino = 'La fecha de término es requerida'
  else if (f.fechaTermino <= f.fechaInicio) errors.fechaTermino = 'Debe ser posterior a la fecha de inicio'
  const desvioNum = Number(f.desvio)
  if (f.desvio === '') errors.desvio = 'El porcentaje de desvío es requerido'
  else if (Number.isNaN(desvioNum) || desvioNum < 0 || desvioNum > 100) errors.desvio = 'Debe ser un valor entre 0 y 100'
  return errors
}

export function useCrearForecast(rounds: ForecastRound[]) {
  // A1: nombre propuesto automáticamente por el sistema, editable — se calcula una sola vez al abrir
  // el formulario (alcanza: solo puede haber un forecast activo a la vez, ver ForecastCreatePage).
  const [form, setForm] = useState<CrearForecastForm>(() => ({ ...EMPTY_FORM, titulo: forecastNombreSugerido(rounds) }))
  const [selEquipos, setSelEquipos] = useState<Set<string>>(new Set())
  // F: "se habilitan 2 nuevos campos para hacer una selección múltiple que son de gerencias y
  // equipos" — un Forecast Parcial se puede habilitar por equipo, por gerencia, o ambos a la vez.
  const [selGerencias, setSelGerencias] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [tasas, setTasas] = useState<Record<string, string[]>>(buildDefaultTasas)

  const setTasaValor = (moneda: string, mesIndex: number, valor: string) =>
    setTasas((prev) => ({ ...prev, [moneda]: prev[moneda].map((v, i) => (i === mesIndex ? valor : v)) }))

  const setField = <K extends keyof CrearForecastForm>(field: K, value: CrearForecastForm[K]) => setForm((f) => ({ ...f, [field]: value }))

  // F: dropdowns de selección múltiple (reemplazan la tabla de checkboxes) — onChange entrega la lista
  // completa de valores marcados, no un toggle de a uno.
  const onChangeEquipos = (equipos: string[]) => setSelEquipos(new Set(equipos))

  // F: "dependiendo de la gerencia que has habilitado, se puede seleccionar más de un equipo" — al
  // acotar las gerencias, se podan los equipos ya marcados que queden fuera del nuevo universo
  // disponible, para que la selección nunca incluya algo que el dropdown ya no ofrece.
  const onChangeGerencias = (gerencias: string[]) => {
    const next = new Set(gerencias)
    setSelGerencias(next)
    const disponibles = new Set(equiposDisponiblesParaGerencias(next))
    setSelEquipos((prev) => new Set([...prev].filter((e) => disponibles.has(e))))
  }

  const selPeps = useMemo(() => new Set([...n4CodesForEquipos(selEquipos), ...n4CodesForGerencias(selGerencias)]), [selEquipos, selGerencias])
  const sinGrupos = selEquipos.size === 0 && selGerencias.size === 0
  const baseErrors = submitted ? validate(form) : {}
  const errors: FormErrors = form.tipo === 'parcial' && submitted && sinGrupos ? { ...baseErrors, equipos: 'Selecciona al menos un equipo o una gerencia para un Forecast Parcial' } : baseErrors
  const isValid = Object.keys(validate(form)).length === 0 && (form.tipo !== 'parcial' || !sinGrupos)

  return { form, setField, selEquipos, onChangeEquipos, selGerencias, onChangeGerencias, selPeps, submitted, setSubmitted, errors, isValid, tasas, setTasaValor }
}
