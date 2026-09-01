import { useMemo, useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import { pepsN4, pepsN7, type PepN4Row, type PepN7Row } from '@/data/peps'
import { EMPTY_N7_FILTERS, type PepN7Filters } from './pep-n7-filters-types'
import { nextN7Sort, sortPepN7, type N7SortColumn, type N7SortDir } from './sort-pep-n7'

function matchN7Filters(r: PepN7Row, f: PepN7Filters) {
  return (Object.keys(f) as (keyof PepN7Filters)[]).every((k) => !f[k] || r[k].toLowerCase().includes(f[k].toLowerCase()))
}

export function useEditarPepN4(pepParam: string | undefined) {
  const pep: PepN4Row | undefined = pepsN4.find((r) => r.pep === pepParam)
  const { message, showToast } = useToast()

  const [n7Rows, setN7Rows] = useState<PepN7Row[]>(() => (pep ? (pepsN7[pep.pep] ?? []) : []))
  const [n7Filters, setN7Filters] = useState<PepN7Filters>(EMPTY_N7_FILTERS)
  const [sortCol, setSortCol] = useState<N7SortColumn>(null)
  const [sortDir, setSortDir] = useState<N7SortDir>(null)

  const [cuentaOpen, setCuentaOpen] = useState(false)
  const [n7DrawerOpen, setN7DrawerOpen] = useState(false)
  const [n7Editing, setN7Editing] = useState<PepN7Row | null>(null)
  const [masivoOpen, setMasivoOpen] = useState(false)
  const [deleteRow, setDeleteRow] = useState<PepN7Row | null>(null)
  const [lastRowModal, setLastRowModal] = useState(false)

  const filtered = useMemo(() => n7Rows.filter((r) => matchN7Filters(r, n7Filters)), [n7Rows, n7Filters])
  const sorted = useMemo(() => sortPepN7(filtered, sortCol, sortDir), [filtered, sortCol, sortDir])

  const submitN7 = (form: { bandera: string; destino: string; ceco: string }) => {
    if (!pep) return
    if (n7Editing) {
      setN7Rows((prev) => prev.map((r) => (r === n7Editing ? { ...r, bandera: form.bandera.split(' ')[0], destino: form.destino, ceco: form.ceco } : r)))
      showToast('PEP N7 actualizado exitosamente.')
    } else {
      setN7Rows((prev) => [
        ...prev,
        { servicio: pep.servicio, cod: `${pep.pep}-${form.ceco.slice(-3)}-${String(Date.now()).slice(-3)}`, bandera: form.bandera.split(' ')[0], destino: prev[0]?.destino ?? '', ceco: form.ceco },
      ])
      showToast('PEP N7 creado exitosamente.')
    }
    setN7DrawerOpen(false)
  }

  return {
    pep,
    message,
    showToast,
    n7Filters,
    onChangeN7Filter: <K extends keyof PepN7Filters>(k: K, v: PepN7Filters[K]) => setN7Filters((f) => ({ ...f, [k]: v })),
    clearN7Filters: () => setN7Filters(EMPTY_N7_FILTERS),
    sorted,
    sortCol,
    sortDir,
    onSort: (col: NonNullable<N7SortColumn>) => {
      const next = nextN7Sort(sortCol, sortDir, col)
      setSortCol(next.col)
      setSortDir(next.dir)
    },
    cuentaOpen,
    openCuenta: () => setCuentaOpen(true),
    closeCuenta: () => setCuentaOpen(false),
    n7DrawerOpen,
    n7Editing,
    openCreateN7: () => {
      setN7Editing(null)
      setN7DrawerOpen(true)
    },
    openEditN7: (row: PepN7Row) => {
      setN7Editing(row)
      setN7DrawerOpen(true)
    },
    closeN7Drawer: () => setN7DrawerOpen(false),
    submitN7,
    masivoOpen,
    openMasivo: () => setMasivoOpen(true),
    closeMasivo: () => setMasivoOpen(false),
    deleteRow,
    requestDelete: (row: PepN7Row) => (n7Rows.length <= 1 ? setLastRowModal(true) : setDeleteRow(row)),
    cancelDelete: () => setDeleteRow(null),
    confirmDelete: () => {
      setN7Rows((prev) => prev.filter((r) => r !== deleteRow))
      setDeleteRow(null)
    },
    lastRowModal,
    closeLastRowModal: () => setLastRowModal(false),
  }
}
