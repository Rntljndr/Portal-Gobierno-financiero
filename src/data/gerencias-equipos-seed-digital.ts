import type { AreaSeed } from './gerencias-equipos-seed-types'

export const AREA_DIGITAL: AreaSeed = {
  id: 'area-digital',
  nombre: 'Digital',
  desde: 2024,
  gerencias: [
    {
      id: 'ger-ecommerce',
      nombre: 'E-Commerce',
      desde: 2024,
      equipos: [
        {
          id: 'eq-frontend',
          nombre: 'Frontend',
          desde: 2024,
          miembros: [
            { nombre: 'Antonia Castro', email: 'antonia.castro@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Benjamín Toro', email: 'benjamin.toro@cencosud.com', rol: 'Visualizador', desde: 2024 },
            { nombre: 'Isidora Flores', email: 'isidora.flores@cencosud.com', rol: 'Visualizador', desde: 2025 },
          ],
        },
        {
          id: 'eq-checkout',
          nombre: 'Checkout',
          desde: 2025,
          miembros: [
            { nombre: 'Francisco Ibarra', email: 'francisco.ibarra@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Constanza Araya', email: 'constanza.araya@cencosud.com', rol: 'Visualizador', desde: 2025 },
          ],
        },
        {
          id: 'eq-catalogo',
          nombre: 'Catálogo',
          desde: 2026,
          miembros: [
            { nombre: 'Maximiliano Soto', email: 'maximiliano.soto@cencosud.com', rol: 'Editor', desde: 2026 },
            { nombre: 'Emilia Guzmán', email: 'emilia.guzman@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
      ],
    },
    {
      id: 'ger-analytics',
      nombre: 'Analytics',
      desde: 2025,
      equipos: [
        {
          id: 'eq-data-science',
          nombre: 'Data Science',
          desde: 2025,
          miembros: [
            { nombre: 'Gabriel Soto', email: 'gabriel.soto@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Trinidad Muñoz', email: 'trinidad.munoz@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
        {
          id: 'eq-bi',
          nombre: 'Business Intelligence',
          desde: 2026,
          miembros: [{ nombre: 'Agustín Palma', email: 'agustin.palma@cencosud.com', rol: 'Editor', desde: 2026 }],
        },
      ],
    },
    {
      id: 'ger-cx-digital',
      nombre: 'CX Digital',
      desde: 2024,
      equipos: [
        {
          id: 'eq-experiencia-cliente',
          nombre: 'Experiencia Cliente',
          desde: 2024,
          miembros: [
            { nombre: 'Javiera Pinto', email: 'javiera.pinto@cencosud.com', rol: 'Editor', desde: 2024 },
            { nombre: 'Nicolás Herrera', email: 'nicolas.herrera@cencosud.com', rol: 'Visualizador', desde: 2024 },
          ],
        },
        {
          id: 'eq-soporte-digital',
          nombre: 'Soporte Digital',
          desde: 2025,
          miembros: [
            { nombre: 'Catalina Rebolledo', email: 'catalina.rebolledo@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Vicente Figueroa', email: 'vicente.figueroa@cencosud.com', rol: 'Visualizador', desde: 2025 },
          ],
        },
      ],
    },
    {
      id: 'ger-marketing-digital',
      nombre: 'Marketing Digital',
      desde: 2025,
      equipos: [
        {
          id: 'eq-performance',
          nombre: 'Performance',
          desde: 2025,
          miembros: [
            { nombre: 'Martina Leiva', email: 'martina.leiva@cencosud.com', rol: 'Editor', desde: 2025 },
            { nombre: 'Tomás Escobar', email: 'tomas.escobar@cencosud.com', rol: 'Visualizador', desde: 2026 },
          ],
        },
        {
          id: 'eq-contenidos',
          nombre: 'Contenidos',
          desde: 2026,
          miembros: [{ nombre: 'Amanda Villagra', email: 'amanda.villagra@cencosud.com', rol: 'Editor', desde: 2026 }],
        },
      ],
    },
  ],
}
