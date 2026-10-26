import { useState } from 'react'
import { Breadcrumb, PageHeader, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { useIngresos } from './lib/use-ingresos'
import { exportIngresosXlsx } from './lib/export-ingresos'
import { IngresosToolbar } from './components/ingresos-toolbar'
import { IngresosTable } from './components/ingresos-table'
import { AgregarIngresoDrawer } from './components/agregar-ingreso-drawer'
import { ImportarIngresosDrawer } from './components/importar-ingresos-drawer'

export function IngresosPage() {
  const state = useIngresos()
  const [showAgregar, setShowAgregar] = useState(false)
  const [showImportar, setShowImportar] = useState(false)
  const { message, showToast } = useToast()

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: 'Ingresos' }]} />
      <PageHeader title="Ingresos" subtitle="Ingresos mensuales por bandera, en la moneda local del país de cada bandera" />

      <IngresosToolbar
        ejercicio={state.ejercicio}
        ejercicios={state.ejercicios}
        onChangeEjercicio={state.setEjercicio}
        onAgregar={() => setShowAgregar(true)}
        onImportar={() => setShowImportar(true)}
        onDescargar={() => exportIngresosXlsx(state.ejercicio, state.rows)}
      />

      <IngresosTable
        ejercicio={state.ejercicio}
        rows={state.rows}
        sortCol={state.sortCol}
        sortDir={state.sortDir}
        onSort={state.onSort}
        editingRows={state.editingRows}
        onToggleEditar={state.toggleEditing}
        onEditMes={state.updateMes}
      />

      <AgregarIngresoDrawer
        open={showAgregar}
        onClose={() => setShowAgregar(false)}
        ejercicio={state.ejercicio}
        opciones={state.banderasSinCargar}
        onGuardar={(bandera, meses) => {
          state.upsertRegistro(bandera, meses)
          showToast('Registro agregado correctamente.')
        }}
      />
      <ImportarIngresosDrawer
        open={showImportar}
        onClose={() => setShowImportar(false)}
        ejercicio={state.ejercicio}
        onAplicar={(items) => {
          state.applyBulk(items)
          showToast(`${items.length} filas aplicadas correctamente.`)
        }}
      />
      <Toast message={message} />
    </div>
  )
}
