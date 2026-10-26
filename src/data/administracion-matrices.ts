import { paisesCatalogo } from './administracion-catalogos'

export const EJERCICIOS_CATALOGO = [2025, 2026, 2027]

/** Unidades de moneda local por 1 USD, por país y mes — mismo criterio que la pantalla de referencia. */
export const tasasHyperionCatalogo: Record<number, Record<string, number[]>> = {
  2027: {
    Argentina: [1624, 1607, 1614, 1616, 1649, 1720, 1789, 1811, 1903, 1954, 1958, 1983],
    Brasil: [5.19, 5.13, 5.21, 5.08, 5.06, 5.23, 5.25, 5.3, 5.22, 5.22, 5.16, 5.23],
    Chile: [870, 848, 894, 882, 883, 890, 919, 909, 907, 905, 893, 880],
    Colombia: [3290, 3341, 3446, 3426, 3606, 3480, 3322, 3272, 3260, 3319, 3324, 3450],
    'Estados Unidos': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Perú: [3.31, 3.28, 3.35, 3.35, 3.35, 3.32, 3.34, 3.34, 3.34, 3.3, 3.31, 3.37],
    Uruguay: [39.7, 39.6, 41.1, 41, 40.9, 41.2, 41.3, 41.5, 41.6, 41.8, 41.9, 41.63],
  },
  2026: {
    Argentina: [1430, 1450, 1480, 1500, 1520, 1540, 1550, 1560, 1570, 1580, 1590, 1600],
    Brasil: [4.95, 5.02, 5.08, 5.1, 5.15, 5.2, 5.18, 5.22, 5.25, 5.28, 5.3, 5.34],
    Chile: [905, 912, 920, 928, 935, 940, 948, 952, 958, 962, 968, 975],
    Colombia: [3920, 3950, 3980, 4010, 4040, 4060, 4085, 4100, 4120, 4140, 4160, 4185],
    'Estados Unidos': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Perú: [3.7, 3.71, 3.72, 3.74, 3.75, 3.76, 3.77, 3.78, 3.79, 3.8, 3.82, 3.84],
    Uruguay: [38.1, 38.3, 38.6, 38.9, 39.1, 39.3, 39.5, 39.7, 39.9, 40.1, 40.3, 40.5],
  },
  2025: {
    Argentina: [], Brasil: [], Chile: [], Colombia: [], 'Estados Unidos': [], Perú: [], Uruguay: [],
  },
}

export const paisesConMoneda = paisesCatalogo.map((p) => ({ pais: p.nombre, moneda: p.moneda }))

const SIN_FECHAS = {
  Argentina: Array(12).fill(null),
  Brasil: Array(12).fill(null),
  Chile: Array(12).fill(null),
  Colombia: Array(12).fill(null),
  'Estados Unidos': Array(12).fill(null),
  Perú: Array(12).fill(null),
  Uruguay: Array(12).fill(null),
}

/** Fecha en que SAP cierra contablemente cada país y mes — null si no está configurada (se informa con "—"). */
export const fechasCierreSapCatalogo: Record<number, Record<string, (string | null)[]>> = {
  2027: { ...SIN_FECHAS },
  2026: {
    ...SIN_FECHAS,
    Argentina: ['2026-02-05', '2026-03-05', '2026-04-06', '2026-05-05', '2026-06-05', '2026-07-06', '2026-08-05', '2026-09-04', '2026-10-05', '2026-11-05', '2026-12-04', null],
  },
  2025: { ...SIN_FECHAS },
}
