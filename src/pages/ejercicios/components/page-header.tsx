import { Breadcrumb, Icon, PageHeader } from '@/shared/ui'

export function EjerciciosPageHeader() {
  return (
    <>
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Ejercicios' }]} />
      <PageHeader
        title="Ejercicios de presupuesto"
        subtitle="Gestión de ejercicios de presupuesto anual"
        action={
          <div className="flex items-center gap-2.5 rounded-[9px] border border-[#B6E7CC] bg-[#E1FBEF] px-3.5 py-2 text-[13px] font-bold text-[#1F6F47]">
            <Icon name="check" size={13} color="#1F6F47" stroke={2.6} />
            Ejercicio 2027 aperturado
          </div>
        }
      />
    </>
  )
}
