export type UsuarioModulo = 'SIP' | 'PMO' | 'Seguridad'

export interface UsuarioRol {
  modulo: UsuarioModulo
  rol: string
}

export interface UsuarioCatalogo {
  id: string
  nombre: string
  apellido: string
  email: string
  roles: UsuarioRol[]
  activo: boolean
}

export const moduloOpciones: UsuarioModulo[] = ['SIP', 'PMO', 'Seguridad']
export const rolOpciones = ['Administrador', 'Control de gestión', 'Usuario', 'Seguridad']

export const usuariosCatalogo: UsuarioCatalogo[] = [
  { id: 'u1', nombre: 'Andrea', apellido: 'Morales', email: 'andrea.morales@cencosud.cl', roles: [{ modulo: 'SIP', rol: 'Administrador' }, { modulo: 'Seguridad', rol: 'Seguridad' }], activo: true },
  { id: 'u2', nombre: 'Carlos', apellido: 'Vega', email: 'carlos.vega@cencosud.com.ar', roles: [{ modulo: 'SIP', rol: 'Control de gestión' }, { modulo: 'SIP', rol: 'Usuario' }], activo: true },
  { id: 'u3', nombre: 'Luis', apellido: 'Pinto', email: 'luis.pinto@cencosud.cl', roles: [{ modulo: 'SIP', rol: 'Usuario' }], activo: true },
  { id: 'u4', nombre: 'Marcela', apellido: 'Rios', email: 'marcela.rios@cencosud.com.ar', roles: [{ modulo: 'SIP', rol: 'Usuario' }], activo: true },
  { id: 'u5', nombre: 'Fernando', apellido: 'Soto', email: 'fernando.soto@cencosud.cl', roles: [{ modulo: 'SIP', rol: 'Control de gestión' }], activo: true },
  { id: 'u6', nombre: 'Valentina', apellido: 'Reyes', email: 'valentina.reyes@cencosud.com', roles: [{ modulo: 'PMO', rol: 'Usuario' }], activo: true },
  { id: 'u7', nombre: 'Jorge', apellido: 'Paredes', email: 'jorge.paredes@cencosud.com.co', roles: [{ modulo: 'SIP', rol: 'Usuario' }, { modulo: 'PMO', rol: 'Usuario' }], activo: false },
  { id: 'u8', nombre: 'Daniela', apellido: 'Flores', email: 'daniela.flores@cencosud.cl', roles: [{ modulo: 'Seguridad', rol: 'Seguridad' }], activo: true },
]
