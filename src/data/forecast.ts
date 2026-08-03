export interface ForecastMonth {
  month: string
  real: number | null
  forecast: number
  optimistic: number
}

export const forecastMonths: ForecastMonth[] = [
  { month: 'Ene', real: 780000, forecast: 770000, optimistic: 820000 },
  { month: 'Feb', real: 830000, forecast: 810000, optimistic: 870000 },
  { month: 'Mar', real: 850000, forecast: 820000, optimistic: 880000 },
  { month: 'Abr', real: 880000, forecast: 855000, optimistic: 905000 },
  { month: 'May', real: 850000, forecast: 820000, optimistic: 880000 },
  { month: 'Jun', real: null, forecast: 875000, optimistic: 920000 },
  { month: 'Jul', real: null, forecast: 910000, optimistic: 965000 },
  { month: 'Ago', real: null, forecast: 895000, optimistic: 945000 },
  { month: 'Sep', real: null, forecast: 920000, optimistic: 980000 },
  { month: 'Oct', real: null, forecast: 950000, optimistic: 1010000 },
  { month: 'Nov', real: null, forecast: 975000, optimistic: 1035000 },
  { month: 'Dic', real: null, forecast: 1000000, optimistic: 1060000 },
]
