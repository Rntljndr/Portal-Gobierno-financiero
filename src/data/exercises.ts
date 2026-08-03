export interface ClosedExercise {
  year: number
  peps: string
}

export interface ExerciseSummary {
  year: number
  description: string
}

export const currentExercise: ExerciseSummary = {
  year: 2026,
  description: 'Preliminares a Marzo · 3.540 PEPs activos',
}

export const nextExercise: ExerciseSummary = {
  year: 2027,
  description: 'Preliminares a Marzo · 3.540 PEPs · $142.3M',
}

export const closedExercises: ClosedExercise[] = [
  { year: 2025, peps: '3.210 PEPs' },
  { year: 2024, peps: '2.980 PEPs' },
]

export const pendingLineasCount = 12
