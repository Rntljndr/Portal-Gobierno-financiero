import { Select } from '@/shared/ui'

interface AdministracionEjercicioSelectProps {
  anio: number
  anios: number[]
  onChange: (anio: number) => void
}

/** "Configuración vigente" (F: "debe estar a lo largo y por sobre el resumen, como la card del
 * forecast activo"; luego: "la misma card... debe estar para Alcances y permisos") — barra de ancho
 * completo con el año vigente destacado y el selector "Ejercicio" (F: "como en Tasa de Hyperion"),
 * usada por Gerencias y Equipos y por Alcances y permisos. Cambiar el año reconstruye la
 * estructura/alcances vigentes que trae cada pantalla (ver `estructuraParaAnio`). */
export function AdministracionEjercicioSelect({ anio, anios, onChange }: AdministracionEjercicioSelectProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1 text-[10.5px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Configuración vigente</div>
          <div className="text-[18px] font-extrabold tracking-tight text-foreground">Ejercicio {anio}</div>
        </div>
        <div className="w-[160px]">
          <Select value={String(anio)} onChange={(v) => onChange(Number(v))} options={anios.map((a) => String(a))} />
        </div>
      </div>
    </div>
  )
}
