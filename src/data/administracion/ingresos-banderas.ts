import type { Pais } from '@/data/services'

export interface BanderaMaestro {
  /** Nombre exacto — es la clave de negocio: así se identifica la bandera en la carga de Ingresos, no por `codigo`. */
  nombre: string
  codigo: string
  pais: Pais
  division: string
}

/**
 * PROVISORIO — las 10 filas de Argentina son las visibles en la imagen de referencia validada en la
 * reunión de definición; el resto de los países se agregó después, a pedido explícito, para poder
 * probar la grilla con más de un país (no vienen de la imagen ni de un export real). No se reutilizó
 * `src/data/banderas.ts`: sus nombres de División no coinciden con los de esta imagen. Pendiente
 * reemplazar TODO este archivo por el export vigente de SIP (Gestión de Gasto > Ejercicio).
 */
export const BANDERAS_MAESTRO: BanderaMaestro[] = [
  { nombre: 'Argentina-Aventura', codigo: 'AAO', pais: 'Argentina', division: 'Aventura' },
  { nombre: 'Argentina-Mdh-Blaisten Ecommerce', codigo: 'ABC', pais: 'Argentina', division: 'Mejoramiento del Hogar' },
  { nombre: 'Argentina-Retail Financiero', codigo: 'ACO', pais: 'Argentina', division: 'Retail Financiero' },
  { nombre: 'Argentina-Sm-Spid35', codigo: 'ACS', pais: 'Argentina', division: 'Supermercado' },
  { nombre: 'Argentina-Sm- Disco Ecommerce', codigo: 'ADC', pais: 'Argentina', division: 'Supermercado' },
  { nombre: 'Argentina-Mdh-Blaisten', codigo: 'AEB', pais: 'Argentina', division: 'Mejoramiento del Hogar' },
  { nombre: 'Argentina-Mdh-Easy Ecommerce', codigo: 'AEC', pais: 'Argentina', division: 'Mejoramiento del Hogar' },
  { nombre: 'Argentina-Mdh-Easy', codigo: 'AEE', pais: 'Argentina', division: 'Mejoramiento del Hogar' },
  { nombre: 'Argentina-Clientes-Cenco Media', codigo: 'AFD', pais: 'Argentina', division: 'Clientes' },
  { nombre: 'Argentina-Corporación', codigo: 'AGC', pais: 'Argentina', division: 'Corporación' },
  { nombre: 'Chile-Sm-Jumbo', codigo: 'CSJ', pais: 'Chile', division: 'Supermercado' },
  { nombre: 'Chile-Sm-Santa Isabel', codigo: 'CSS', pais: 'Chile', division: 'Supermercado' },
  { nombre: 'Chile-Mdh-Easy', codigo: 'CEE', pais: 'Chile', division: 'Mejoramiento del Hogar' },
  { nombre: 'Chile-Retail Financiero', codigo: 'CCO', pais: 'Chile', division: 'Retail Financiero' },
  { nombre: 'Chile-Corporación', codigo: 'CGC', pais: 'Chile', division: 'Corporación' },
  { nombre: 'Brasil-Sm-GBarbosa', codigo: 'BSG', pais: 'Brasil', division: 'Supermercado' },
  { nombre: 'Brasil-Corporación', codigo: 'BGC', pais: 'Brasil', division: 'Corporación' },
  { nombre: 'Colombia-Retail Financiero', codigo: 'COF', pais: 'Colombia', division: 'Retail Financiero' },
  { nombre: 'Colombia-Corporación', codigo: 'CLC', pais: 'Colombia', division: 'Corporación' },
  { nombre: 'Perú-Sm-Wong', codigo: 'PSW', pais: 'Perú', division: 'Supermercado' },
  { nombre: 'Perú-Sm-Metro', codigo: 'PSM', pais: 'Perú', division: 'Supermercado' },
  { nombre: 'Perú-Corporación', codigo: 'PGC', pais: 'Perú', division: 'Corporación' },
  { nombre: 'Uruguay-Corporación', codigo: 'UGC', pais: 'Uruguay', division: 'Corporación' },
  { nombre: 'Estados Unidos-Corporación', codigo: 'EGC', pais: 'Estados Unidos', division: 'Corporación' },
]
