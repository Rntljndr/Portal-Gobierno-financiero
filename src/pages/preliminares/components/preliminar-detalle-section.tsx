import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Modal, Toast } from '@/shared/ui'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { useRole } from '@/shared/context/use-role'
import { usePreliminaresStore } from '../lib/use-preliminares-store'
import { PreliminaresKpis } from './preliminares-kpis'
import { PreliminaresTable } from './preliminares-table'
import { HeadcountTable } from './headcount-table'

export function PreliminarDetalleSection({ n4 }: { n4: PreliminarN4Row }) {
  const store = usePreliminaresStore()
  const navigate = useNavigate()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const totalAcumReal = n4.children.reduce((s, c) => s + c.acumReal, 0)
  const totalForecast = n4.children.reduce((s, c) => s + c.forecastMes, 0)
  const planBase = totalAcumReal + totalForecast * 5

  const toggleSelect = (codigo: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(codigo)) next.delete(codigo)
      else next.add(codigo)
      return next
    })

  const goToSubPep = (row: PreliminarRow) => navigate(`/preliminares/${encodeURIComponent(n4.codigo)}/${encodeURIComponent(row.codigo)}`)

  const confirmGuardar = () => {
    store.markDefinitivo([...selected])
    setShowConfirm(false)
    setToast(`${selected.size} líneas pasadas a Definitivo correctamente`)
    setSelected(new Set())
  }

  return (
    <>
      <PreliminaresKpis planBase={planBase} acumReal={totalAcumReal} disponible={planBase - totalAcumReal} />

      <div className="mx-8 mb-3 flex items-center justify-between">
        <div className="text-[13.5px] font-bold text-foreground">PEPs N7 · {PRELIM_MES_OPEN_LABEL}</div>
        {isCdG && (
          <Button variant="primary" size="sm" onClick={() => setShowConfirm(true)} disabled={selected.size === 0} className="disabled:opacity-40">
            Guardar Definitivo {selected.size > 0 && `(${selected.size})`}
          </Button>
        )}
      </div>

      <PreliminaresTable
        rows={n4.children.map((c) => ({ ...c, parentServicio: n4.servicio }))}
        isN7
        itemLabel="PEPs N7"
        mesLabel={PRELIM_MES_OPEN_LABEL.split(' ')[0]}
        selectable={isCdG}
        selected={selected}
        onToggleSelect={toggleSelect}
        onRowClick={goToSubPep}
      />

      <div className="mx-8 mb-2 text-[13.5px] font-bold text-foreground">Headcount</div>
      <div className="mx-8 mb-8">
        <HeadcountTable rows={n4.headcount} />
      </div>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Guardar definitivo"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button variant="primary" onClick={confirmGuardar}>Sí, guardar definitivo</Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-cs-gris-oscuro">
          Estás a punto de guardar a definitivos "{selected.size} PEP"?
        </p>
      </Modal>

      <Toast message={toast} />
    </>
  )
}
