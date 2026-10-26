import type { AreaSeed } from './gerencias-equipos-seed-types'

export const AREA_ESTRATEGIA: AreaSeed = {
  id: 'area-estrategia',
  nombre: 'Estrategia',
  desde: 2024,
  gerencias: [
    {
      id: 'ger-pmo',
      nombre: 'PMO',
      desde: 2024,
      equipos: [
        {
          id: 'eq-gobierno-proyectos',
          nombre: 'Gobierno de Proyectos',
          desde: 2024,
          miembros: [
            { nombre: 'Renato Galecio', email: 'renato.galecio@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Andrea Morales', email: 'andrea.morales@cencosud.com', rol: 'Editor', desde: 2024 },
          ],
        },
        {
          id: 'eq-pmo-digital',
          nombre: 'PMO Digital',
          desde: 2026,
          miembros: [{ nombre: 'Consuelo Bahamondes', email: 'consuelo.bahamondes@cencosud.com', rol: 'Visualizador', desde: 2026 }],
        },
      ],
    },
    {
      id: 'ger-finanzas-corp',
      nombre: 'Finanzas Corporativas',
      desde: 2025,
      equipos: [
        {
          id: 'eq-control-gestion',
          nombre: 'Control de Gestión',
          desde: 2025,
          miembros: [
            { nombre: 'Sofía Bustos', email: 'sofia.bustos@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Esteban Morales', email: 'esteban.morales@cencosud.com', rol: 'Visualizador', desde: 2025 },
          ],
        },
        {
          id: 'eq-tesoreria',
          nombre: 'Tesorería',
          desde: 2026,
          miembros: [{ nombre: 'Daniela Concha', email: 'daniela.concha@cencosud.com', rol: 'Editor', desde: 2026 }],
        },
      ],
    },
    {
      id: 'ger-legal-compliance',
      nombre: 'Legal y Compliance',
      desde: 2025,
      equipos: [
        {
          id: 'eq-compliance',
          nombre: 'Compliance',
          desde: 2025,
          miembros: [
            { nombre: 'Bárbara Aguilera', email: 'barbara.aguilera@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Jorge Catalán', email: 'jorge.catalan@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
      ],
    },
  ],
}
