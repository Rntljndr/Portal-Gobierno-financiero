import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, PageHeader, Toast } from '@/shared/ui'
import { PepN4Card } from './components/pep-n4-card'
import { PepN7AdminTable } from './components/pep-n7-admin-table'
import { PepN7Toolbar } from './components/pep-n7-toolbar'
import { PepN7Modals } from './components/pep-n7-modals'
import { useEditarPepN4 } from './lib/use-editar-pep-n4'

export function EditarPepN4Page() {
  const { pep: pepParam } = useParams()
  const navigate = useNavigate()
  const s = useEditarPepN4(pepParam)

  if (!s.pep) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP no encontrado" text="No existe un PEP N4 con ese código." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Mis Servicios', to: '/ejercicios/mis-servicios' },
          { label: 'ABM PEPS – Nivel 4', to: '/ejercicios/mis-servicios/peps' },
          { label: s.pep.pep },
        ]}
      />
      <PageHeader title={`Editar PEP N4 "${s.pep.pep}"`} />

      <div className="p-[0_32px_28px]">
        <PepN4Card pep={s.pep} onGuardar={() => s.showToast('Los cambios se han guardado exitosamente.')} onNuevaCuenta={s.openCuenta} />

        <PepN7Toolbar filters={s.n7Filters} onChangeFilter={s.onChangeN7Filter} onClearFilters={s.clearN7Filters} onMasivo={s.openMasivo} onCrear={s.openCreateN7} />

        <PepN7AdminTable rows={s.sorted} sortCol={s.sortCol} sortDir={s.sortDir} onSort={s.onSort} onEdit={s.openEditN7} onDelete={s.requestDelete} />
      </div>

      <div className="flex justify-center gap-4 border-t border-border bg-white p-[16px_32px]">
        <Button variant="outline" onClick={() => navigate('/ejercicios/mis-servicios/peps')}>
          Volver
        </Button>
      </div>

      <PepN7Modals
        pep={s.pep}
        cuentaOpen={s.cuentaOpen}
        onCuentaClose={s.closeCuenta}
        onCuentaCreated={(cuenta) => s.showToast(`PEP N4 con cuenta contable ${cuenta} creado correctamente.`)}
        n7DrawerOpen={s.n7DrawerOpen}
        onN7DrawerClose={s.closeN7Drawer}
        n7Editing={s.n7Editing}
        onN7Submit={s.submitN7}
        masivoOpen={s.masivoOpen}
        onMasivoClose={s.closeMasivo}
        onMasivoApplied={(count) => {
          s.closeMasivo()
          s.showToast(`${count} PEP N7 creados correctamente.`)
        }}
        deleteRow={s.deleteRow}
        onDeleteCancel={s.cancelDelete}
        onDeleteConfirm={s.confirmDelete}
        lastRowModal={s.lastRowModal}
        onLastRowClose={s.closeLastRowModal}
      />

      <Toast message={s.message} />
    </div>
  )
}
