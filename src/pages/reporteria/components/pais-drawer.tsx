import { useState } from 'react'
import { countryFlags, paisMacroData, divisionData } from '@/data/reporteria'
import { Drawer } from '@/shared/ui'
import { PaisDrawerTasaTab, PaisDrawerIpcTab } from './pais-drawer-macro-tabs'
import { PaisDrawerDivisionesTab } from './pais-drawer-divisiones-tab'

type PaisDrawerTab = 'tasa' | 'ipc' | 'divisiones'

const TABS: { id: PaisDrawerTab; label: string }[] = [
  { id: 'tasa', label: 'Tasa de Cambio' },
  { id: 'ipc', label: 'IPC' },
  { id: 'divisiones', label: 'Divisiones' },
]

export function PaisDrawer({ pais, onClose }: { pais: string; onClose: () => void }) {
  const [tab, setTab] = useState<PaisDrawerTab>('tasa')
  const macro = paisMacroData[pais]
  const divisiones = divisionData
    .map((g) => ({ nombre: g.nombre, children: g.children.filter((c) => c.nombre.startsWith(`${pais}-`)) }))
    .filter((g) => g.children.length > 0)

  return (
    <Drawer open onClose={onClose} title={`${countryFlags[pais] || ''} ${pais}`} subtitle="Indicadores presupuesto 2027" wide>
      <div className="-mx-[22px] -mt-5 flex border-b-2 border-[#E8EFFE] bg-[#F8FAFF]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-0.5 p-[11px_20px] text-[13px] whitespace-nowrap ${tab === t.id ? 'border-b-2 border-primary font-bold text-primary' : 'font-medium text-[#6B7A9E]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-5">
        {tab === 'tasa' && macro && <PaisDrawerTasaTab macro={macro} />}
        {tab === 'ipc' && macro && <PaisDrawerIpcTab macro={macro} />}
        {tab === 'divisiones' && <PaisDrawerDivisionesTab pais={pais} divisiones={divisiones} />}
        {!macro && tab !== 'divisiones' && <div className="p-12 text-center text-xs text-muted-foreground">Sin datos macro para este país</div>}
      </div>
    </Drawer>
  )
}
