import type { AreaSeed } from './gerencias-equipos-seed-types'

export const AREA_OPERACIONES: AreaSeed = {
  id: 'area-operaciones',
  nombre: 'Operaciones',
  desde: 2024,
  gerencias: [
    {
      id: 'ger-infraestructura',
      nombre: 'Infraestructura',
      desde: 2024,
      equipos: [
        {
          id: 'eq-facilities',
          nombre: 'Facilities',
          desde: 2024,
          miembros: [
            { nombre: 'Rocío Espinoza', email: 'rocio.espinoza@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Álvaro Jofré', email: 'alvaro.jofre@cencosud.com', rol: 'Visualizador', desde: 2024 },
          ],
        },
        {
          id: 'eq-seguridad-fisica',
          nombre: 'Seguridad Física',
          desde: 2025,
          miembros: [{ nombre: 'Ximena Godoy', email: 'ximena.godoy@cencosud.com', rol: 'Editor', desde: 2025 }],
        },
      ],
    },
    {
      id: 'ger-supply-chain',
      nombre: 'Supply Chain',
      desde: 2024,
      equipos: [
        {
          id: 'eq-planificacion',
          nombre: 'Planificación',
          desde: 2024,
          miembros: [
            { nombre: 'Pablo Valenzuela', email: 'pablo.valenzuela@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Daniela Reyes', email: 'daniela.reyes@cencosud.com', rol: 'Visualizador', desde: 2024 },
          ],
        },
        {
          id: 'eq-abastecimiento',
          nombre: 'Abastecimiento',
          desde: 2026,
          miembros: [
            { nombre: 'Cristóbal Vidal', email: 'cristobal.vidal@cencosud.com', rol: 'Editor', desde: 2026 },
            { nombre: 'Millaray Huenul', email: 'millaray.huenul@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
      ],
    },
    {
      id: 'ger-logistica',
      nombre: 'Logística',
      desde: 2024,
      equipos: [
        {
          id: 'eq-distribucion',
          nombre: 'Distribución',
          desde: 2024,
          miembros: [
            { nombre: 'Fernanda Carrasco', email: 'fernanda.carrasco@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Joaquín Fernández', email: 'joaquin.fernandez@cencosud.com', rol: 'Visualizador', desde: 2024 },
          ],
        },
        {
          id: 'eq-transporte',
          nombre: 'Transporte',
          desde: 2025,
          miembros: [{ nombre: 'Gonzalo Painemal', email: 'gonzalo.painemal@cencosud.com', rol: 'Editor', desde: 2025 }],
        },
      ],
    },
    {
      id: 'ger-operaciones-retail',
      nombre: 'Operaciones Retail',
      desde: 2025,
      equipos: [
        {
          id: 'eq-tiendas',
          nombre: 'Tiendas',
          desde: 2025,
          miembros: [
            { nombre: 'Carolina Yévenes', email: 'carolina.yevenes@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Ricardo Maldonado', email: 'ricardo.maldonado@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
      ],
    },
  ],
}
