import { useState } from 'react'
import { Icon } from '@/shared/ui'

/** Texto adaptado del prototipo real, ajustado a lo que este fixture realmente modela. */
export function ConsolidadoCriterios() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-8 mb-8 rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-[12px_18px] text-left">
        <span className="text-[13px] font-bold text-foreground">Criterios de lectura del consolidado</span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={13} color="#0047B0" />
      </button>
      {open && (
        <div className="flex flex-col gap-2.5 border-t border-border p-[14px_18px] text-xs text-muted-foreground">
          <p>La variación es Nuevo Plan menos Forecast Base + IPC. Un valor positivo indica un aumento de gasto respecto de esa base. Forecast Base se conserva como referencia informativa.</p>
          <p>Destino USD y Destino ML reparten el plan de cada servicio entre sus países destino declarados, convertido a USD o a la moneda local de cada destino respectivamente. Origen ML muestra el 100% en el país que origina el gasto, sin repartir.</p>
          <p>Las divisiones y gerencias se muestran dentro de la dimensión elegida. Abrir una fila no cambia el alcance de las tarjetas: todas responden a los mismos filtros del reporte.</p>
          <p>El resumen por rubro agrupa en Servicios, Nómina y Amortización, igual que el tablero original. Servicios reúne el 100% de los rubros reales de SIP (Software, Hardware, Servicios, Consultoría) — este fixture no modela líneas de Nómina ni Amortización como servicios, por lo que esas dos tarjetas muestran 0 líneas.</p>
          <p>El tipo de gasto proviene del campo real de origen de cada servicio: «Nuevo Servicio» corresponde a tipoOrigen "Nuevo", «Recurrente» a tipoOrigen "Recurrente".</p>
        </div>
      )}
    </div>
  )
}
