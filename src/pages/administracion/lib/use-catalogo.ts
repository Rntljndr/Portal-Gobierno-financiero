import { useState } from 'react'

export function useCatalogo<T extends { id: string }>(seed: T[]) {
  const [rows, setRows] = useState<T[]>(seed)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [deleteRow, setDeleteRow] = useState<T | null>(null)

  const openCreate = () => {
    setEditing(null)
    setDrawerOpen(true)
  }
  const openEdit = (row: T) => {
    setEditing(row)
    setDrawerOpen(true)
  }
  const closeDrawer = () => setDrawerOpen(false)

  const create = (row: T) => {
    setRows((prev) => [row, ...prev])
    setDrawerOpen(false)
  }
  const update = (id: string, patch: Partial<T>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    setDrawerOpen(false)
  }

  const requestDelete = (row: T) => setDeleteRow(row)
  const cancelDelete = () => setDeleteRow(null)
  const confirmDelete = () => {
    setRows((prev) => prev.filter((r) => r.id !== deleteRow?.id))
    setDeleteRow(null)
  }

  return {
    rows,
    query,
    setQuery: (v: string) => {
      setQuery(v)
      setPage(1)
    },
    page,
    setPage,
    drawerOpen,
    editing,
    openCreate,
    openEdit,
    closeDrawer,
    create,
    update,
    deleteRow,
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}
