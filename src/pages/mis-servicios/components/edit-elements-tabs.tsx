import { Link } from 'react-router'
import { Icon, type IconName } from '@/shared/ui'

const ITEMS: { to: string; icon: IconName; title: string; meta: string }[] = [
  { to: '/ejercicios/mis-servicios/drivers', icon: 'drives', title: 'Drivers', meta: '199 elementos' },
  { to: '/ejercicios/mis-servicios/cecos', icon: 'ceco', title: 'Centros de costo', meta: '354 elementos' },
  { to: '/ejercicios/mis-servicios/banderas', icon: 'flag', title: 'Banderas', meta: '120 elementos' },
  { to: '/ejercicios/mis-servicios/peps', icon: 'config', title: 'ABM PEPS N4', meta: '8 elementos' },
]

export function EditElementsTabs() {
  return (
    <>
      <div className="mx-8 mt-2.5 mb-2.5 text-[11px] font-bold tracking-[0.16em] text-[#5B6478] uppercase">
        Editar elementos del ejercicio
      </div>
      <div className="mx-8 mb-[22px] flex gap-3.5 rounded-2xl border border-[#DCE4F0] bg-[linear-gradient(180deg,#F4F7FB_0%,#EAEFF7_100%)] p-5.5">
        {ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative flex flex-1 items-center gap-3.5 rounded-xl border border-[#D9E2EE] bg-white p-[18px_22px] text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-px hover:border-primary hover:shadow-[0_4px_12px_rgba(0,71,176,0.1)]"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF4FF]">
              <Icon name={item.icon} size={16} color="#0047B0" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-bold tracking-tight text-[#0F1D40] group-hover:text-primary">
                {item.title}
              </span>
              <span className="text-[11.5px] text-muted-foreground">{item.meta}</span>
            </div>
            <span className="ml-auto text-lg font-normal text-[#B7C0D1] group-hover:translate-x-0.5 group-hover:text-primary">
              ›
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
