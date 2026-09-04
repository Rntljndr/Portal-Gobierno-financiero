import { useNavigate } from 'react-router'
import { BulkUploadDrawer, Toast } from '@/shared/ui'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { useRole } from '@/shared/context/use-role'
import { usePrelimToolbar } from '../lib/use-prelim-toolbar'
import { calcPrelimKpis, calcPrelimStats } from '../lib/preliminares-calc'
import { downloadPreliminaresCsv } from '../lib/download-csv'
import { PreliminaresKpis } from './preliminares-kpis'
import { PreliminaresStatsRow } from './preliminares-stats-row'
import { PreliminaresToolbar } from './preliminares-toolbar'
import { PreliminaresSearchPanel } from './preliminares-search-panel'
import { PreliminaresTable } from './preliminares-table'
import { HeadcountTable } from './headcount-table'
import { GuardarDefinitivoModal } from './guardar-definitivo-modal'
import { CierreContableModal } from './cierre-contable-modal'

export function PreliminarDetalleSection({ n4 }: { n4: PreliminarN4Row }) {
  const navigate = useNavigate()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const t = usePrelimToolbar({ rows: n4.children })

  const kpis = calcPrelimKpis(n4.children)
  const stats = calcPrelimStats(n4.children)

  const goToSubPep = (row: PreliminarRow) => navigate(`/preliminares/${encodeURIComponent(n4.codigo)}/${encodeURIComponent(row.codigo)}`)

  return (
    <>
      <PreliminaresKpis {...kpis} />
      {isCdG && <PreliminaresStatsRow totalServicio={stats.total} conPrelim={stats.conPrelim} definitivos={stats.definitivos} />}

      <PreliminaresToolbar
        filtersOpen={t.filtersOpen}
        onToggleFilters={() => t.setFiltersOpen((v) => !v)}
        activeFilterCount={t.search ? 1 : 0}
        onGuardarDefinitivo={() => t.setShowConfirm(true)}
        selectedCount={t.selected.size}
        allSelected={t.allSelected}
        onToggleSelectAll={t.toggleSelectAll}
        onOpenCargaMasiva={() => t.setShowBulkUpload(true)}
        onDownload={() => downloadPreliminaresCsv(t.filteredRows, `Preliminares_N7_${n4.codigo}.csv`)}
        onCierreContable={() => t.setShowCierre(true)}
        mesCerrado={t.mesCerrado}
      />
      {t.filtersOpen && <PreliminaresSearchPanel label="Nombre / código PEP N7" search={t.search} onSearchChange={t.setSearch} />}

      <PreliminaresTable
        rows={t.filteredRows.map((c) => ({ ...c, parentServicio: n4.servicio }))}
        isN7
        itemLabel="PEPs N7"
        mesLabel={PRELIM_MES_OPEN_LABEL.split(' ')[0]}
        selectable={isCdG}
        selected={t.selected}
        onToggleSelect={t.toggleSelect}
        onRowClick={goToSubPep}
      />

      <div className="mx-8 mb-2 text-[13.5px] font-bold text-foreground">Headcount</div>
      <div className="mx-8 mb-8">
        <HeadcountTable rows={n4.headcount} />
      </div>

      <GuardarDefinitivoModal open={t.showConfirm} count={t.selected.size} onClose={() => t.setShowConfirm(false)} onConfirm={t.confirmGuardar} />
      <BulkUploadDrawer
        open={t.showBulkUpload}
        onClose={() => t.setShowBulkUpload(false)}
        onApplied={t.handleBulkUploadApplied}
        title="Carga masiva de preliminares"
        applyLabel="Aplicar carga"
      />
      <CierreContableModal open={t.showCierre} mesLabel={PRELIM_MES_OPEN_LABEL} onClose={() => t.setShowCierre(false)} onConfirm={t.confirmCierre} />

      <Toast message={t.toast} />
      <Toast message={t.cierreToast} />
    </>
  )
}
