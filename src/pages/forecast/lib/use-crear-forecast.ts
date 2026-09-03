import { useState } from 'react'
import { buildDefaultTasas, type ForecastTipo } from '@/data/forecast'

export interface CrearForecastForm {
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaTermino: string
  desvio: string
  tipo: ForecastTipo
  notificar: boolean
}

const EMPTY_FORM: CrearForecastForm = { titulo: '', descripcion: '', fechaInicio: '', fechaTermino: '', desvio: '', tipo: 'global', notificar: false }

export type FormErrors = Partial<Record<'titulo' | 'fechaInicio' | 'fechaTermino' | 'desvio' | 'peps', string>>

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

export function useCrearForecast() {
  const [form, setForm] = useState<CrearForecastForm>(EMPTY_FORM)
  const [selPeps, setSelPeps] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [tasas, setTasas] = useState<Record<string, string[]>>(buildDefaultTasas)

  const setTasaValor = (moneda: string, mesIndex: number, valor: string) =>
    setTasas((prev) => ({ ...prev, [moneda]: prev[moneda].map((v, i) => (i === mesIndex ? valor : v)) }))

  const setField = <K extends keyof CrearForecastForm>(field: K, value: CrearForecastForm[K]) => setForm((f) => ({ ...f, [field]: value }))

  const togglePep = (codigo: string) =>
    setSelPeps((prev) => {
      const next = new Set(prev)
      if (next.has(codigo)) next.delete(codigo)
      else next.add(codigo)
      return next
    })

  const baseErrors = submitted ? validate(form) : {}
  const errors: FormErrors = form.tipo === 'parcial' && submitted && selPeps.size === 0 ? { ...baseErrors, peps: 'Selecciona al menos un PEP para un Forecast Parcial' } : baseErrors
  const isValid = Object.keys(validate(form)).length === 0 && (form.tipo !== 'parcial' || selPeps.size > 0)

  return { form, setField, selPeps, togglePep, submitted, setSubmitted, errors, isValid, tasas, setTasaValor }
}
