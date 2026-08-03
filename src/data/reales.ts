export type MovimientoStatus = 'Posted' | 'Pending'

export interface MovimientoReal {
  pep: string
  doc: string
  vendor: string
  amount: number
  currency: string
  date: string
  status: MovimientoStatus
}

export const movimientosReales: MovimientoReal[] = [
  { pep: 'PEP-2027-001', doc: '5500-0042', vendor: 'Oracle Argentina S.A.', amount: 23250000, currency: 'USD', date: '2026-03-22', status: 'Posted' },
  { pep: 'PEP-2027-003', doc: '5500-0043', vendor: 'IBM Chile Ltda.', amount: 9030000, currency: 'CLP', date: '2026-03-21', status: 'Posted' },
  { pep: 'PEP-2027-005', doc: '5500-0044', vendor: 'Globant Argentina', amount: 95580000, currency: 'ARS', date: '2026-03-20', status: 'Pending' },
  { pep: 'PEP-2027-007', doc: '5500-0045', vendor: 'Mercado Libre Colombia', amount: 121680000, currency: 'COP', date: '2026-03-19', status: 'Posted' },
  { pep: 'PEP-2027-008', doc: '5500-0046', vendor: 'Atento Chile', amount: 48000000, currency: 'CLP', date: '2026-03-18', status: 'Posted' },
  { pep: 'PEP-2027-002', doc: '5500-0047', vendor: 'UX Studio AR', amount: 8584, currency: 'ARS', date: '2026-03-17', status: 'Pending' },
  { pep: 'PEP-2027-006', doc: '5500-0048', vendor: 'Shutterstock LLC', amount: 12500, currency: 'USD', date: '2026-03-15', status: 'Posted' },
]

export const currencyOptions = [
  { value: 'USD', label: 'USD — Dólar' },
  { value: 'CLP', label: 'CLP — Peso Chileno' },
  { value: 'PEN', label: 'PEN — Sol Peruano' },
  { value: 'ARS', label: 'ARS — Peso Argentino' },
  { value: 'BRL', label: 'BRL — Real Brasilero' },
]
