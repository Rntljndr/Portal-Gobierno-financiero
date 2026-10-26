import { useState } from 'react'
import { Alert, Breadcrumb, Button, Icon, PageHeader } from '@/shared/ui'
import { V3_EJERCICIO, type V3Pais } from '@/data/gasto-it-v3'
import { ReporteContext, type ReporteCtx } from './lib/contexto'
import { useReporteEstado } from './lib/use-reporte-estado'
import { alcanceLabel, enGrupo, lineasDelAlcance, monedaDe, ROL_CONFIG } from './lib'
import { VistaSelector } from './components/encabezado/vista-selector'
import { AjustesDrawer } from './components/encabezado/ajustes-drawer'
import { MonedaSelector } from './components/encabezado/moneda-selector'
import { VistaEjecutiva } from './components/ejecutiva/vista-ejecutiva'
import { FocosCard } from './components/ejecutiva/focos-card'
import { DetalleSeccion } from './components/detalle/detalle-seccion'
import { GestionVista } from './components/gestion/gestion-vista'

/** Reporte Ejercicio en Curso — tres visiones: Tecnología, Negocio y Gestión del gasto (forecast en edición
 * y preliminares en destino): selección de
 * visión y país, período (mes / acumulado / proyectado) que gobierna todo lo de abajo, vista ejecutiva,
 * detalle del gasto por dimensión y, al final y colapsadas, las sugerencias de acción. */
export function ReporteGastoItV3Page() {
  const s = useReporteEstado()
  const [ajustesOpen, setAjustesOpen] = useState(false)
  const { alcance } = s
  const cfg = ROL_CONFIG[alcance.rol]
  const lineas = lineasDelAlcance(alcance)

  const ctx: ReporteCtx = {
    rol: alcance.rol,
    alcance,
    alcanceLabel: alcanceLabel(alcance),
    lineas,
    lineasAbajo: lineas.filter((l) => enGrupo(s.grupoRubro, l)),
    periodo: s.periodo,
    setPeriodo: s.setPeriodo,
    grupoRubro: s.grupoRubro,
    setGrupoRubro: s.setGrupoRubro,
    setPais: (p) => s.cambiarAlcance({ pais: p as V3Pais }),
    ajustes: s.ajustes,
    vistaMoneda: s.vistaMoneda,
    moneda: monedaDe(s.vistaMoneda, alcance.pais),
    profundizar: s.profundizar,
  }
  // Cambiar la selección remonta los bloques para aplicar lo que cada visión trae desplegado por defecto.
  const k = `${alcance.rol}|${alcance.pais}|${alcance.marca}`

  return (
    <ReporteContext.Provider value={ctx}>
      <div className="flex h-full flex-col overflow-y-auto">
        <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Reporte ejercicio en curso' }]} />
        <PageHeader
          title={`Gasto IT · Ejercicio en curso ${V3_EJERCICIO}`}
          action={
            <>
              <MonedaSelector value={s.vistaMoneda} pais={alcance.pais} conOrigen={cfg.conOrigen} onChange={s.setVistaMoneda} />
              <Button variant="outline" onClick={() => setAjustesOpen(true)}>
                <Icon name="config" size={16} color="currentColor" /> Ajustes
              </Button>
            </>
          }
        />
        <div className="mx-8 mb-8 flex flex-col gap-6">
          {/* Los avisos van siempre bajo el título y antes de cualquier tarjeta. */}
          {alcance.rol === 'gestion' && (
            <Alert title="Datos antes del cierre">
              El forecast en edición y los preliminares no llegan a la reportería hasta el cierre. Aquí se ven en moneda destino: el forecast contra
              la versión anterior y los preliminares contra el forecast del mes.
            </Alert>
          )}
          <VistaSelector alcance={alcance} onChange={s.cambiarAlcance} />
          {alcance.rol === 'gestion' ? (
            <GestionVista key={`g-${k}`} />
          ) : (
            <>
              <VistaEjecutiva key={`e-${k}`} />
              <DetalleSeccion key={`d-${k}-${s.drill}`} estado={s.detalle} onChange={s.setDetalle} defaultOpen={cfg.abiertos.includes('detalle') || s.drill > 0} />
              <FocosCard key={`f-${k}`} defaultOpen={false} />
            </>
          )}
        </div>
      </div>
      <AjustesDrawer open={ajustesOpen} onClose={() => setAjustesOpen(false)} ajustes={s.ajustes} onChange={s.setAjustes} />
    </ReporteContext.Provider>
  )
}
