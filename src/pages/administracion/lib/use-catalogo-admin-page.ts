import { useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import type { CatalogoFieldDef } from '../components/catalogo-field'
import { useCatalogo } from './use-catalogo'

interface UseCatalogoAdminPageArgs<T extends { id: string }> {
  seed: T[]
  fields: CatalogoFieldDef<T>[]
  searchKeys: (keyof T & string)[]
  buildRow: (values: Partial<T>) => T
  entityLabel: string
  pageSize: number
}

export function useCatalogoAdminPage<T extends { id: string }>({ seed, fields, searchKeys, buildRow, entityLabel, pageSize }: UseCatalogoAdminPageArgs<T>) {
  const s = useCatalogo<T>(seed)
  const { message, showToast } = useToast()
  const [form, setForm] = useState<Partial<T>>({})

  const q = s.query.trim().toLowerCase()
  const filtered = q ? s.rows.filter((row) => searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))) : s.rows

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageSafe = Math.min(s.page, totalPages)
  const paged = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  const openCreate = () => {
    const defaults: Partial<T> = {}
    for (const f of fields) if (f.type === 'toggle') defaults[f.key] = true as T[keyof T & string]
    setForm(defaults)
    s.openCreate()
  }
  const openEdit = (row: T) => {
    setForm(row)
    s.openEdit(row)
  }

  const canSubmit = fields.filter((f) => f.required).every((f) => Boolean(form[f.key]))

  const submit = () => {
    if (s.editing) {
      s.update(s.editing.id, form)
      showToast(`${entityLabel} actualizado correctamente.`)
    } else {
      s.create(buildRow(form))
      showToast(`${entityLabel} creado correctamente.`)
    }
  }

  const confirmDelete = () => {
    s.confirmDelete()
    showToast(`${entityLabel} eliminado correctamente.`)
  }

  return { s, message, filtered, totalPages, pageSafe, paged, form, setForm, openCreate, openEdit, canSubmit, submit, confirmDelete }
}
