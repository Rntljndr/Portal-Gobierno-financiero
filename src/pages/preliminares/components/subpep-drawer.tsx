import { Drawer } from '@/shared/ui'
import type { PreliminarSubPep } from '@/data/preliminares'
import { prelimFmt } from '../lib/preliminares-calc'

interface SubPepDrawerProps {
  n7: { codigo: string; servicio: string; subPeps?: PreliminarSubPep[]; moneda: string } | null
  onClose: () => void
}

export function SubPepDrawer({ n7, onClose }: SubPepDrawerProps) {
  return (
    <Drawer open={!!n7} onClose={onClose} title={n7 ? `SubPEPs · ${n7.servicio}` : 'SubPEPs'} eyebrow={n7?.codigo}>
      {n7?.subPeps && n7.subPeps.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {n7.subPeps.map((sp) => (
            <div key={sp.codigo} className="flex items-center justify-between rounded-xl border border-border p-[12px_14px]">
              <div>
                <div className="text-[13px] font-semibold text-foreground">{sp.nombre}</div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">{sp.codigo}</div>
              </div>
              <div className="font-mono text-[13px] font-bold text-primary tabular-nums">{prelimFmt(sp.monto, n7.moneda)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-muted-foreground">Este PEP N7 no tiene SubPEPs asociados.</div>
      )}
    </Drawer>
  )
}
