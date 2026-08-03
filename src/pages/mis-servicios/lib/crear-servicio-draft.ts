import { filtroOpciones, type Pais, type TipoOrigen } from '@/data/services'

export interface CrearServicioDraft {
  nombre: string
  pais: Pais | ''
  cuentaContable: string
  bandera: string
  gerenciaPadre: string
  gerencia: string
  equipo: string
  contratoUsd: boolean
  tipoOrigen: TipoOrigen | ''
}

export const EMPTY_DRAFT: CrearServicioDraft = {
  nombre: '', pais: '', cuentaContable: '', bandera: '', gerenciaPadre: '', gerencia: '', equipo: '', contratoUsd: false, tipoOrigen: '',
}

export const cuentas = filtroOpciones.cuentaContable
export const banderas = filtroOpciones.bandera

const PAIS_CODES: Record<string, string> = { Argentina: 'AR', Brasil: 'BR', Chile: 'CL', Colombia: 'CO', Perú: 'PE', 'Estados Unidos': 'US' }

export function isDraftValid(d: CrearServicioDraft) {
  return !!(d.nombre.trim() && d.pais && d.cuentaContable && d.bandera && d.gerenciaPadre && d.gerencia && d.equipo && d.tipoOrigen)
}

export function pepPreview(d: CrearServicioDraft) {
  const paisCode = d.pais ? PAIS_CODES[d.pais] || d.pais.slice(0, 2).toUpperCase() : 'XX'
  const equipoCode = d.equipo ? d.equipo.replace(/[^A-Za-zÁÉÍÓÚáéíóú]/g, '').slice(0, 3).toUpperCase() : '---'
  return `${paisCode} · ${d.cuentaContable || 'XXXX'} · ${equipoCode} · 001`
}
