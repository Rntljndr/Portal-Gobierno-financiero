/** Cruce Responsable × División del reporte "OPEX 2026 - IT Chile", extraído con la matriz real de
 * Power BI ("Explorar estos datos") el 13/10/2026 y verificado celda a celda: la suma de cada
 * responsable y de cada división cuadra exactamente contra sus totales respectivos. Montos en pesos CLP
 * (raw). Solo se listan las celdas con monto distinto de cero. Separado de `opex-it-chile.ts` por
 * tamaño de archivo. */

export interface OpexCruceItem {
  responsable: string
  division: string
  proy: number
  plan: number
}

export const opexResponsablePorDivision: OpexCruceItem[] = [
  { responsable: 'Director IT', division: 'Clientes', plan: 397040895, proy: 269130542 },
  { responsable: 'Director IT', division: 'Corporación', plan: 0, proy: -35037801 },
  { responsable: 'Director IT', division: 'Mejoramiento del Hogar', plan: 1817603932, proy: 1669637616 },
  { responsable: 'Director IT', division: 'Shopping', plan: 32879542, proy: 25650409 },
  { responsable: 'Director IT', division: 'Supermercado', plan: 3971646031, proy: 3559519812 },
  { responsable: 'Director IT', division: 'Tiendas por departamento', plan: 3094636692, proy: 3127155195 },

  { responsable: 'Luis Muñoz', division: 'Clientes', plan: 65204704, proy: 61641234 },
  { responsable: 'Luis Muñoz', division: 'Corporación', plan: 27118548, proy: 27079533 },
  { responsable: 'Luis Muñoz', division: 'Mejoramiento del Hogar', plan: 1464085112, proy: 1521411528 },
  { responsable: 'Luis Muñoz', division: 'Shopping', plan: 7816620, proy: 16953930 },
  { responsable: 'Luis Muñoz', division: 'Supermercado', plan: 3490191646, proy: 3759371742 },
  { responsable: 'Luis Muñoz', division: 'Tiendas por departamento', plan: 1279934795, proy: 1278758245 },

  { responsable: 'Teodosio Varela', division: 'Tiendas por departamento', plan: 4479315127, proy: 4266687894 },

  { responsable: 'CCT', division: 'Clientes', plan: 558002891, proy: 519126674 },
  { responsable: 'CCT', division: 'Mejoramiento del Hogar', plan: 338326346, proy: 345843356 },
  { responsable: 'CCT', division: 'Shopping', plan: 74558, proy: 72071 },
  { responsable: 'CCT', division: 'Supermercado', plan: 1156336398, proy: 1320599572 },
  { responsable: 'CCT', division: 'Tiendas por departamento', plan: 717527173, proy: 774002186 },

  { responsable: 'Alejandro Castillo', division: 'Corporación', plan: 14700828, proy: 14700995 },
  { responsable: 'Alejandro Castillo', division: 'Mejoramiento del Hogar', plan: 708830926, proy: 707800525 },
  { responsable: 'Alejandro Castillo', division: 'Supermercado', plan: 1268629543, proy: 1121290879 },
  { responsable: 'Alejandro Castillo', division: 'Tiendas por departamento', plan: 286523256, proy: 268002135 },

  { responsable: 'Hipólito Soto', division: 'Mejoramiento del Hogar', plan: 976225620, proy: 981828686 },
  { responsable: 'Hipólito Soto', division: 'Supermercado', plan: 705730498, proy: 684931445 },

  { responsable: 'Kiyoshi Tsukame', division: 'Clientes', plan: 704747834, proy: 589030770 },
  { responsable: 'Kiyoshi Tsukame', division: 'Mejoramiento del Hogar', plan: 99330475, proy: 83347500 },
  { responsable: 'Kiyoshi Tsukame', division: 'Supermercado', plan: 386788031, proy: 315865726 },
  { responsable: 'Kiyoshi Tsukame', division: 'Tiendas por departamento', plan: 447285387, proy: 281011539 },

  { responsable: 'Orland Vergara', division: 'Mejoramiento del Hogar', plan: 283188156, proy: 202641190 },
  { responsable: 'Orland Vergara', division: 'Supermercado', plan: 765861738, proy: 798322188 },

  { responsable: 'Felipe Pachá', division: 'Mejoramiento del Hogar', plan: 60000000, proy: 54363683 },
  { responsable: 'Felipe Pachá', division: 'Supermercado', plan: 300000000, proy: 288330844 },
  { responsable: 'Felipe Pachá', division: 'Tiendas por departamento', plan: 253448724, proy: 227053934 },

  { responsable: 'Christian Rivera', division: 'Clientes', plan: 109091554, proy: 106144788 },
  { responsable: 'Christian Rivera', division: 'Mejoramiento del Hogar', plan: 35885659, proy: 35576441 },
  { responsable: 'Christian Rivera', division: 'Shopping', plan: 100392, proy: 95410 },
  { responsable: 'Christian Rivera', division: 'Supermercado', plan: 241405827, proy: 244604453 },
  { responsable: 'Christian Rivera', division: 'Tiendas por departamento', plan: 63193345, proy: 61994133 },

  { responsable: 'Fernando Rey', division: 'Mejoramiento del Hogar', plan: 45897383, proy: 54470389 },
  { responsable: 'Fernando Rey', division: 'Supermercado', plan: 144889620, proy: 94928037 },
  { responsable: 'Fernando Rey', division: 'Tiendas por departamento', plan: 77424241, proy: 53953777 },

  { responsable: 'Gastos sin PEP', division: 'Clientes', plan: 0, proy: -21839621 },
  { responsable: 'Gastos sin PEP', division: 'Mejoramiento del Hogar', plan: 0, proy: 121551334 },
  { responsable: 'Gastos sin PEP', division: 'Shopping', plan: 0, proy: 194236 },
  { responsable: 'Gastos sin PEP', division: 'Supermercado', plan: 0, proy: 46586810 },
  { responsable: 'Gastos sin PEP', division: 'Tiendas por departamento', plan: 0, proy: 10717447 },

  { responsable: 'Gastos de Proyectos', division: 'Clientes', plan: 15286264, proy: 16526149 },
  { responsable: 'Gastos de Proyectos', division: 'Mejoramiento del Hogar', plan: 24455515, proy: 12073720 },
  { responsable: 'Gastos de Proyectos', division: 'Shopping', plan: 9106956, proy: 1749897 },
  { responsable: 'Gastos de Proyectos', division: 'Supermercado', plan: 110984641, proy: 0 },
  { responsable: 'Gastos de Proyectos', division: 'Tiendas por departamento', plan: 8233222, proy: 0 },
]
