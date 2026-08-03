import type { PepN4Row } from './types'

export const pepN4Tablon: PepN4Row[] = [
  {
    codigo: 'N4-2027-001', nombre: 'Mesa de Ayuda BPO', pais: 'Chile', equipo: 'Oracle', planFactor: 0.910,
    meses: { ene: 1100, feb: 1000, mar: 1200, abr: 1150, may: 1300, jun: 1250, jul: 1200, ago: 1180, sep: 1320, oct: 1280, nov: 1220, dic: 1300 },
    children: [
      { codigo: 'N7-001a', nombre: 'MdA N1 - Soporte básico', pais: 'Chile', equipo: 'Oracle', planFactor: 0.905,
        meses: { ene: 650, feb: 600, mar: 700, abr: 680, may: 770, jun: 740, jul: 710, ago: 700, sep: 780, oct: 750, nov: 720, dic: 770 } },
      { codigo: 'N7-001b', nombre: 'MdA N1 - Escalaciones', pais: 'Chile', equipo: 'Oracle', planFactor: 0.916,
        meses: { ene: 450, feb: 400, mar: 500, abr: 470, may: 530, jun: 510, jul: 490, ago: 480, sep: 540, oct: 530, nov: 500, dic: 530 } },
    ],
  },
  {
    codigo: 'N4-2027-002', nombre: 'ERP Regional SAP', pais: 'Argentina', equipo: 'SAP', planFactor: 0.945,
    meses: { ene: 1800, feb: 1700, mar: 1900, abr: 1850, may: 2000, jun: 1950, jul: 1900, ago: 1880, sep: 2050, oct: 2000, nov: 1950, dic: 2200 },
    children: [
      { codigo: 'N7-002a', nombre: 'SAP FI/CO Mantenimiento', pais: 'Argentina', equipo: 'SAP', planFactor: 0.942,
        meses: { ene: 1050, feb: 1000, mar: 1100, abr: 1050, may: 1150, jun: 1120, jul: 1100, ago: 1090, sep: 1180, oct: 1150, nov: 1120, dic: 1250 } },
      { codigo: 'N7-002b', nombre: 'SAP MM/SD Soporte', pais: 'Argentina', equipo: 'SAP', planFactor: 0.948,
        meses: { ene: 550, feb: 500, mar: 600, abr: 580, may: 630, jun: 610, jul: 590, ago: 580, sep: 640, oct: 630, nov: 610, dic: 690 } },
      { codigo: 'N7-002c', nombre: 'SAP Basis y Seguridad', pais: 'Argentina', equipo: 'SAP', planFactor: 0.952,
        meses: { ene: 200, feb: 200, mar: 200, abr: 220, may: 220, jun: 220, jul: 210, ago: 210, sep: 230, oct: 220, nov: 220, dic: 260 } },
    ],
  },
  {
    codigo: 'N4-2027-003', nombre: 'Plataforma E-Commerce', pais: 'Brasil', equipo: 'AWS', planFactor: 0.971,
    meses: { ene: 1550, feb: 1500, mar: 1600, abr: 1550, may: 1700, jun: 1650, jul: 1600, ago: 1580, sep: 1720, oct: 1680, nov: 1640, dic: 1850 },
    children: [
      { codigo: 'N7-003a', nombre: 'Infraestructura Cloud', pais: 'Brasil', equipo: 'AWS', planFactor: 0.968,
        meses: { ene: 900, feb: 870, mar: 930, abr: 900, may: 980, jun: 960, jul: 930, ago: 920, sep: 1000, oct: 970, nov: 950, dic: 1080 } },
      { codigo: 'N7-003b', nombre: 'Frontend React/Next', pais: 'Brasil', equipo: 'AWS', planFactor: 0.975,
        meses: { ene: 650, feb: 630, mar: 670, abr: 650, may: 720, jun: 690, jul: 670, ago: 660, sep: 720, oct: 710, nov: 690, dic: 770 } },
    ],
  },
  {
    codigo: 'N4-2027-004', nombre: 'Salesforce CRM', pais: 'Colombia', equipo: 'Salesforce', planFactor: 1.020,
    meses: { ene: 1350, feb: 1300, mar: 1400, abr: 1350, may: 1500, jun: 1450, jul: 1400, ago: 1380, sep: 1520, oct: 1480, nov: 1440, dic: 1630 },
    children: [
      { codigo: 'N7-004a', nombre: 'Sales Cloud Licencias', pais: 'Colombia', equipo: 'Salesforce', planFactor: 1.018,
        meses: { ene: 780, feb: 750, mar: 810, abr: 780, may: 860, jun: 840, jul: 810, ago: 800, sep: 880, oct: 860, nov: 830, dic: 950 } },
      { codigo: 'N7-004b', nombre: 'Service Cloud Soporte', pais: 'Colombia', equipo: 'Salesforce', planFactor: 1.022,
        meses: { ene: 570, feb: 550, mar: 590, abr: 570, may: 640, jun: 610, jul: 590, ago: 580, sep: 640, oct: 620, nov: 610, dic: 680 } },
    ],
  },
  {
    codigo: 'N4-2027-005', nombre: 'Seguridad Informática', pais: 'Chile', equipo: 'Microsoft', planFactor: 0.935,
    meses: { ene: 1680, feb: 1620, mar: 1780, abr: 1720, may: 1900, jun: 1850, jul: 1800, ago: 1780, sep: 1950, oct: 1900, nov: 1850, dic: 2100 },
    children: [
      { codigo: 'N7-005a', nombre: 'Microsoft Defender / ATP', pais: 'Chile', equipo: 'Microsoft', planFactor: 0.932,
        meses: { ene: 900, feb: 870, mar: 950, abr: 920, may: 1020, jun: 990, jul: 960, ago: 950, sep: 1040, oct: 1020, nov: 990, dic: 1130 } },
      { codigo: 'N7-005b', nombre: 'SIEM / SOC Operación', pais: 'Chile', equipo: 'Microsoft', planFactor: 0.939,
        meses: { ene: 780, feb: 750, mar: 830, abr: 800, may: 880, jun: 860, jul: 840, ago: 830, sep: 910, oct: 880, nov: 860, dic: 970 } },
    ],
  },
  {
    codigo: 'N4-2027-006', nombre: 'Analítica y Data Lake', pais: 'Colombia', equipo: 'Google Cloud', planFactor: 0.962,
    meses: { ene: 980, feb: 950, mar: 1020, abr: 1000, may: 1100, jun: 1060, jul: 1030, ago: 1010, sep: 1110, oct: 1080, nov: 1050, dic: 1190 },
    children: [
      { codigo: 'N7-006a', nombre: 'BigQuery & Looker', pais: 'Colombia', equipo: 'Google Cloud', planFactor: 0.960,
        meses: { ene: 560, feb: 540, mar: 580, abr: 570, may: 620, jun: 600, jul: 580, ago: 570, sep: 630, oct: 610, nov: 590, dic: 680 } },
      { codigo: 'N7-006b', nombre: 'Pipelines Dataflow', pais: 'Colombia', equipo: 'Google Cloud', planFactor: 0.965,
        meses: { ene: 420, feb: 410, mar: 440, abr: 430, may: 480, jun: 460, jul: 450, ago: 440, sep: 480, oct: 470, nov: 460, dic: 510 } },
    ],
  },
  {
    codigo: 'N4-2027-007', nombre: 'Redes y Comunicaciones', pais: 'Perú', equipo: 'Cisco', planFactor: 0.918,
    meses: { ene: 720, feb: 690, mar: 760, abr: 730, may: 810, jun: 780, jul: 750, ago: 740, sep: 820, oct: 800, nov: 770, dic: 880 },
    children: [
      { codigo: 'N7-007a', nombre: 'SD-WAN Gestión', pais: 'Perú', equipo: 'Cisco', planFactor: 0.915,
        meses: { ene: 420, feb: 400, mar: 440, abr: 430, may: 470, jun: 450, jul: 440, ago: 430, sep: 480, oct: 460, nov: 445, dic: 510 } },
      { codigo: 'N7-007b', nombre: 'NOC Monitoreo 24x7', pais: 'Perú', equipo: 'Cisco', planFactor: 0.922,
        meses: { ene: 300, feb: 290, mar: 320, abr: 300, may: 340, jun: 330, jul: 310, ago: 310, sep: 340, oct: 340, nov: 325, dic: 370 } },
    ],
  },
  {
    codigo: 'N4-2027-008', nombre: 'Gestión de Identidades', pais: 'Brasil', equipo: 'Microsoft', planFactor: 0.988,
    meses: { ene: 850, feb: 820, mar: 900, abr: 870, may: 960, jun: 930, jul: 900, ago: 890, sep: 980, oct: 950, nov: 920, dic: 1050 },
    children: [
      { codigo: 'N7-008a', nombre: 'Azure AD / Entra ID', pais: 'Brasil', equipo: 'Microsoft', planFactor: 0.985,
        meses: { ene: 490, feb: 470, mar: 520, abr: 500, may: 550, jun: 530, jul: 520, ago: 510, sep: 560, oct: 545, nov: 530, dic: 600 } },
      { codigo: 'N7-008b', nombre: 'Privileged Access Mgmt', pais: 'Brasil', equipo: 'Microsoft', planFactor: 0.992,
        meses: { ene: 360, feb: 350, mar: 380, abr: 370, may: 410, jun: 400, jul: 380, ago: 380, sep: 420, oct: 405, nov: 390, dic: 450 } },
    ],
  },
  {
    codigo: 'N4-2027-009', nombre: 'Automatización RPA', pais: 'Argentina', equipo: 'UiPath', planFactor: 1.005,
    meses: { ene: 1100, feb: 1060, mar: 1150, abr: 1120, may: 1240, jun: 1200, jul: 1170, ago: 1150, sep: 1270, oct: 1240, nov: 1200, dic: 1370 },
    children: [
      { codigo: 'N7-009a', nombre: 'Bots Procesos Financieros', pais: 'Argentina', equipo: 'UiPath', planFactor: 1.003,
        meses: { ene: 640, feb: 620, mar: 670, abr: 650, may: 720, jun: 700, jul: 680, ago: 670, sep: 740, oct: 720, nov: 700, dic: 800 } },
      { codigo: 'N7-009b', nombre: 'Bots Procesos RRHH', pais: 'Argentina', equipo: 'UiPath', planFactor: 1.008,
        meses: { ene: 460, feb: 440, mar: 480, abr: 470, may: 520, jun: 500, jul: 490, ago: 480, sep: 530, oct: 520, nov: 500, dic: 570 } },
    ],
  },
  {
    codigo: 'N4-2027-010', nombre: 'Plataforma DevOps', pais: 'Chile', equipo: 'Azure DevOps', planFactor: 0.951,
    meses: { ene: 620, feb: 600, mar: 650, abr: 630, may: 700, jun: 680, jul: 660, ago: 650, sep: 710, oct: 690, nov: 670, dic: 760 },
    children: [
      { codigo: 'N7-010a', nombre: 'CI/CD Pipelines', pais: 'Chile', equipo: 'Azure DevOps', planFactor: 0.949,
        meses: { ene: 360, feb: 350, mar: 380, abr: 370, may: 410, jun: 395, jul: 385, ago: 380, sep: 415, oct: 400, nov: 390, dic: 440 } },
      { codigo: 'N7-010b', nombre: 'Kubernetes & Observabilidad', pais: 'Chile', equipo: 'Azure DevOps', planFactor: 0.954,
        meses: { ene: 260, feb: 250, mar: 270, abr: 260, may: 290, jun: 285, jul: 275, ago: 270, sep: 295, oct: 290, nov: 280, dic: 320 } },
    ],
  },
]
