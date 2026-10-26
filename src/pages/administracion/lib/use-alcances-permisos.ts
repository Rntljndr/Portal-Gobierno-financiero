import { useMemo, useState } from 'react'
import { equipoIdsBajoNodo, estructuraParaAnio, GERENCIAS_EQUIPOS_ANIOS, todosLosEquipos } from '@/data/gerencias-equipos'
import { PERMISOS_SIP_SEED, USUARIOS_SIP } from '@/data/usuarios-sip'

export interface AlcancePermiso {
  ver: boolean
  editar: boolean
}

export type DraftPermisos = Record<string, AlcancePermiso>

function permisosBase(usuarioId: string | null, anio: number, estructura: ReturnType<typeof estructuraParaAnio>): DraftPermisos {
  if (!usuarioId) return {}
  const draft: DraftPermisos = {}
  for (const grant of PERMISOS_SIP_SEED[usuarioId] ?? []) {
    if (grant.desde > anio) continue
    for (const equipoId of equipoIdsBajoNodo(estructura, grant.nodoId)) {
      const actual = draft[equipoId]
      draft[equipoId] = { ver: actual?.ver || grant.ver, editar: actual?.editar || grant.editar }
    }
  }
  return draft
}

function mismoDraft(a: DraftPermisos, b: DraftPermisos): boolean {
  const ids = new Set([...Object.keys(a), ...Object.keys(b)])
  return [...ids].every((id) => (a[id]?.ver ?? false) === (b[id]?.ver ?? false) && (a[id]?.editar ?? false) === (b[id]?.editar ?? false))
}

/** Estado de "Alcances y permisos" (F: "navega en Administración > Alcance y permisos, esto cópialo en
 * el portal... selector de año... al seleccionar el año se trae las configuraciones ejecutadas ese
 * año"). Los alcances reales se guardan por equipo (unidad atómica); asignar un área/gerencia desde la
 * estructura es un atajo que cascada `ver`/`editar` a todos sus equipos vigentes ese año. Sin backend:
 * "Guardar cambios" solo mueve el draft a la línea base en memoria (mismo criterio que el resto del
 * portal, que resetea al recargar). */
export function useAlcancesPermisos() {
  const [anio, setAnio] = useState(GERENCIAS_EQUIPOS_ANIOS[0])
  const [usuarioId, setUsuarioId] = useState<string | null>(null)
  const [buscarUsuario, setBuscarUsuario] = useState('')
  const [buscarEstructura, setBuscarEstructura] = useState('')
  const [draft, setDraft] = useState<DraftPermisos>({})
  const [baseline, setBaseline] = useState<DraftPermisos>({})

  const estructura = useMemo(() => estructuraParaAnio(anio), [anio])
  const equipos = useMemo(() => todosLosEquipos(estructura), [estructura])

  const usuarios = useMemo(() => {
    const q = buscarUsuario.trim().toLowerCase()
    if (!q) return USUARIOS_SIP
    return USUARIOS_SIP.filter((u) => u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [buscarUsuario])

  const usuario = USUARIOS_SIP.find((u) => u.id === usuarioId)

  const seleccionarUsuario = (id: string) => {
    setUsuarioId(id)
    const base = permisosBase(id, anio, estructura)
    setBaseline(base)
    setDraft(base)
  }

  const cambiarAnio = (nuevoAnio: number) => {
    setAnio(nuevoAnio)
    if (!usuarioId) return
    const base = permisosBase(usuarioId, nuevoAnio, estructuraParaAnio(nuevoAnio))
    setBaseline(base)
    setDraft(base)
  }

  const asignarNodo = (nodoId: string) =>
    setDraft((prev) => {
      const next = { ...prev }
      for (const equipoId of equipoIdsBajoNodo(estructura, nodoId)) next[equipoId] = { ver: true, editar: next[equipoId]?.editar ?? false }
      return next
    })

  const setPermisoEquipos = (equipoIds: string[], patch: Partial<AlcancePermiso>) =>
    setDraft((prev) => {
      const next = { ...prev }
      for (const id of equipoIds) {
        const actual = next[id] ?? { ver: false, editar: false }
        const ver = patch.ver ?? actual.ver
        const editar = patch.editar ?? actual.editar
        next[id] = { ver: ver || editar, editar }
      }
      return next
    })

  const quitarEquipo = (equipoId: string) => setPermisoEquipos([equipoId], { ver: false, editar: false })

  const guardarCambios = () => setBaseline(draft)

  const equiposAsignados = equipos.filter((e) => draft[e.id]?.ver)
  const totalVer = equiposAsignados.length
  const totalEditar = equipos.filter((e) => draft[e.id]?.editar).length
  const hayCambios = !mismoDraft(draft, baseline)

  return {
    anio,
    anios: GERENCIAS_EQUIPOS_ANIOS,
    setAnio: cambiarAnio,
    usuarios,
    buscarUsuario,
    setBuscarUsuario,
    usuario,
    usuarioId,
    seleccionarUsuario,
    estructura,
    buscarEstructura,
    setBuscarEstructura,
    draft,
    asignarNodo,
    setPermisoEquipos,
    quitarEquipo,
    equiposAsignados,
    totalVer,
    totalEditar,
    hayCambios,
    guardarCambios,
  }
}
