import type { CurrencyView } from '@/data/reporteria'

export function ConsolidadoSelectPaisEmpty({ vista }: { vista: CurrencyView }) {
  const tipo = vista === 'origen' ? 'origen' : 'destino'
  return (
    <div className="mx-8 mb-8 rounded-xl border border-border bg-white p-[40px_20px] text-center">
      <div className="text-[15px] font-bold text-foreground">Selecciona un país {tipo}</div>
      <div className="mt-1 text-[13px] text-muted-foreground">
        Elige un país para ver su presupuesto en moneda local. Para comparar varios países, utiliza Destino USD.
      </div>
    </div>
  )
}
