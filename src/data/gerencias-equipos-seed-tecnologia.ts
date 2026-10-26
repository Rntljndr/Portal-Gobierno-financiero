import type { AreaSeed } from './gerencias-equipos-seed-types'

export const AREA_TECNOLOGIA: AreaSeed = {
  id: 'area-tecnologia',
  nombre: 'Tecnología',
  desde: 2024,
  gerencias: [
    {
      id: 'ger-it-operaciones',
      nombre: 'IT Operaciones',
      desde: 2024,
      equipos: [
        {
          id: 'eq-infra-cloud',
          nombre: 'Infraestructura Cloud',
          desde: 2024,
          miembros: [
            { nombre: 'Mariana Solís', email: 'mariana.solis@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Tomás Riquelme', email: 'tomas.riquelme@cencosud.com', rol: 'Visualizador', desde: 2024 },
            { nombre: 'Camila Vergara', email: 'camila.vergara@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
        {
          id: 'eq-soporte-n1',
          nombre: 'Soporte N1',
          desde: 2025,
          miembros: [
            { nombre: 'Ignacio Bravo', email: 'ignacio.bravo@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Florencia Paz', email: 'florencia.paz@cencosud.com', rol: 'Visualizador', desde: 2025 },
          ],
        },
        {
          id: 'eq-monitoreo',
          nombre: 'Monitoreo',
          desde: 2026,
          miembros: [
            { nombre: 'Simón Aravena', email: 'simon.aravena@cencosud.com', rol: 'Editor', desde: 2026 },
            { nombre: 'Paulina Díaz', email: 'paulina.diaz@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
      ],
    },
    {
      id: 'ger-it-erp',
      nombre: 'IT ERP',
      desde: 2024,
      equipos: [
        {
          id: 'eq-sap-core',
          nombre: 'SAP Core',
          desde: 2024,
          miembros: [
            { nombre: 'Eduardo Mellado', email: 'eduardo.mellado@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Valentina Rojo', email: 'valentina.rojo@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Diego Fuenzalida', email: 'diego.fuenzalida@cencosud.com', rol: 'Visualizador', desde: 2027 },
          ],
        },
        {
          id: 'eq-integraciones',
          nombre: 'Integraciones',
          desde: 2025,
          miembros: [
            { nombre: 'Belén Quiroz', email: 'belen.quiroz@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Rafael Olivares', email: 'rafael.olivares@cencosud.com', rol: 'Visualizador', desde: 2025 },
          ],
        },
      ],
    },
    {
      id: 'ger-it-seguridad',
      nombre: 'IT Seguridad',
      desde: 2024,
      hasta: 2027,
      equipos: [
        {
          id: 'eq-soc',
          nombre: 'SOC',
          desde: 2024,
          hasta: 2027,
          miembros: [
            { nombre: 'Patricia Núñez', email: 'patricia.nunez@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Rodrigo Sepúlveda', email: 'rodrigo.sepulveda@cencosud.com', rol: 'Visualizador', desde: 2024 },
          ],
        },
        {
          id: 'eq-gestion-accesos',
          nombre: 'Gestión de Accesos',
          desde: 2025,
          hasta: 2027,
          miembros: [{ nombre: 'Natalia Cid', email: 'natalia.cid@cencosud.com', rol: 'Editor', desde: 2025 }],
        },
      ],
    },
    {
      id: 'ger-it-redes',
      nombre: 'IT Redes',
      desde: 2026,
      equipos: [
        {
          id: 'eq-networking',
          nombre: 'Networking',
          desde: 2026,
          miembros: [
            { nombre: 'Josefina Lara', email: 'josefina.lara@cencosud.com', rol: 'Editor', desde: 2026 },
            { nombre: 'Matías Contreras', email: 'matias.contreras@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
      ],
    },
    {
      id: 'ger-it-qa',
      nombre: 'IT QA',
      desde: 2024,
      equipos: [
        {
          id: 'eq-automatizacion-qa',
          nombre: 'Automatización QA',
          desde: 2024,
          miembros: [
            { nombre: 'Cristina Salas', email: 'cristina.salas@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Hernán Vera', email: 'hernan.vera@cencosud.com', rol: 'Visualizador', desde: 2025 },
          ],
        },
        {
          id: 'eq-testing-manual',
          nombre: 'Testing Manual',
          desde: 2024,
          miembros: [{ nombre: 'Loreto Peña', email: 'loreto.pena@cencosud.com', rol: 'Visualizador', desde: 2024 }],
        },
      ],
    },
    {
      id: 'ger-it-arquitectura',
      nombre: 'IT Arquitectura',
      desde: 2025,
      equipos: [
        {
          id: 'eq-arquitectura-cloud',
          nombre: 'Arquitectura Cloud',
          desde: 2025,
          miembros: [
            { nombre: 'Felipe Zamora', email: 'felipe.zamora@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Antonella Rivas', email: 'antonella.rivas@cencosud.com', rol: 'Editor', desde: 2026 },
          ],
        },
      ],
    },
  ],
}
