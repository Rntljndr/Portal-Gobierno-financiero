import { Breadcrumb, Icon } from '@/shared/ui'

export function ReporteriaHeader() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Reportería 2027' },
        ]}
      />
      <div className="flex items-start justify-between p-[10px_32px_20px]">
        <div>
          <div className="text-[26px] leading-tight font-bold tracking-tight text-primary">
            Reportería próximo ejercicio 2027
          </div>
          <div className="mt-1 text-[13px] text-muted-foreground">
            Análisis en tiempo real del ejercicio presupuestario en curso
          </div>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-white px-3.5 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro opacity-50"
        >
          <Icon name="config" size={14} color="currentColor" /> Configuraciones
        </button>
      </div>
    </>
  )
}
