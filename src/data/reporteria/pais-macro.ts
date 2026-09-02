import type { PaisMacroData } from './types'

function tasas(vals: number[]) {
  return vals.map((tasa) => ({ tasa }))
}

function ipcs(vals: number[]) {
  return vals.map((valor) => ({ valor }))
}

export const paisMacroData: Record<string, PaisMacroData> = {
  Chile: {
    monedaLocal: 'CLP',
    tasaCambio: tasas([953.4, 961.8, 969.2, 948.7, 944.1, 951.3, 958.6, 962.1, 955.8, 948.3, 941.7, 935.2]),
    ipc: ipcs([0.3, 0.4, 0.5, 0.3, 0.2, 0.4, 0.3, 0.4, 0.3, 0.2, 0.3, 0.4]),
  },
  Argentina: {
    monedaLocal: 'ARS',
    tasaCambio: tasas([832.0, 874.5, 921.0, 976.3, 1045.8, 1098.2, 1154.7, 1213.4, 1275.6, 1340.4, 1407.4, 1477.8]),
    ipc: ipcs([4.2, 5.1, 6.3, 5.8, 7.2, 6.9, 8.1, 7.4, 7.8, 8.3, 7.9, 8.6]),
  },
  Brasil: {
    monedaLocal: 'BRL',
    tasaCambio: tasas([4.92, 4.97, 5.03, 5.11, 5.18, 5.08, 5.02, 5.09, 5.14, 5.21, 5.18, 5.24]),
    ipc: ipcs([0.42, 0.38, 0.56, 0.61, 0.44, 0.52, 0.38, 0.47, 0.51, 0.43, 0.56, 0.48]),
  },
  Colombia: {
    monedaLocal: 'COP',
    tasaCambio: tasas([4120.0, 4085.3, 4208.7, 4175.4, 4092.1, 4143.8, 4231.2, 4187.6, 4142.3, 4198.9, 4254.1, 4310.8]),
    ipc: ipcs([0.74, 0.62, 0.81, 0.55, 0.68, 0.71, 0.58, 0.64, 0.72, 0.67, 0.75, 0.59]),
  },
  Perú: {
    monedaLocal: 'PEN',
    tasaCambio: tasas([3.72, 3.74, 3.71, 3.78, 3.82, 3.76, 3.79, 3.81, 3.84, 3.77, 3.73, 3.76]),
    ipc: ipcs([0.28, 0.31, 0.25, 0.34, 0.29, 0.38, 0.27, 0.32, 0.29, 0.35, 0.31, 0.28]),
  },
  Uruguay: {
    monedaLocal: 'UYU',
    tasaCambio: tasas([38.4, 38.9, 39.2, 39.8, 40.1, 40.5, 40.9, 41.2, 41.6, 42.0, 42.4, 42.8]),
    ipc: ipcs([0.52, 0.48, 0.61, 0.57, 0.44, 0.63, 0.55, 0.59, 0.51, 0.47, 0.54, 0.5]),
  },
}
