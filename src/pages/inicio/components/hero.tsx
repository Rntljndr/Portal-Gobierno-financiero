import { useNavigate } from 'react-router'
import { Button, Icon } from '@/shared/ui'
import { heroSummary } from '@/data/dashboard'

function MetaRow({ label, value, total }: { label: string; value: string; total?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between text-[13px] ${total ? 'mt-1 border-t border-white/16 pt-2.5' : ''}`}>
      <span className="text-white/78">{label}</span>
      <span className="font-extrabold text-white tabular-nums">{value}</span>
    </div>
  )
}

export function DashboardHero() {
  const navigate = useNavigate()

  return (
    <div className="relative mx-8 mb-6 grid grid-cols-[1.5fr_1fr] gap-6 overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#061494_0%,#0047B0_60%,#2A6FDB_100%)] p-[26px_30px] text-white">
      <div className="relative z-1">
        <div className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-white/82 uppercase">
          <span className="size-2 rounded-full bg-[#22C55E] shadow-[0_0_0_3px_rgba(34,197,94,0.3)]" />
          Ejercicio 2027 · Presupuesto abierto
        </div>
        <div className="text-[26px] leading-tight font-extrabold tracking-tight">12 líneas presupuestarias asignadas</div>
        <div className="mt-2 mb-4.5 max-w-[540px] text-[13.5px] leading-relaxed text-white/88">
          Revisá tus servicios, ajustá los montos si corresponde y enviá a Control de Gestión antes del cierre.
        </div>
        <div className="flex gap-2.5">
          <Button variant="primary" onClick={() => navigate('/ejercicios/mis-servicios')}>
            Ir a Mis Servicios <Icon name="arrow_right" size={13} color="#fff" />
          </Button>
          <Button variant="onBlue" onClick={() => navigate('/ejercicios')}>
            Ver Ejercicios
          </Button>
        </div>
      </div>
      <div className="relative z-1 flex flex-col gap-2 rounded-xl border border-white/18 bg-white/10 p-[14px_18px]">
        <MetaRow label="Pendientes" value={String(heroSummary.pendientes)} />
        <MetaRow label="Enviados" value={String(heroSummary.enviados)} />
        <MetaRow label="Aprobados" value={String(heroSummary.aprobados)} />
        <MetaRow label="Monto total" value={heroSummary.montoTotal} total />
      </div>
    </div>
  )
}
