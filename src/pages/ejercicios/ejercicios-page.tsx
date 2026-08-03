import { useState } from 'react'
import { useNavigate } from 'react-router'
import { EjerciciosPageHeader } from './components/page-header'
import { NotificationBanner } from './components/notification-banner'
import { CurrentExerciseSection } from './components/current-exercise-section'
import { NextExerciseSection } from './components/next-exercise-section'
import { ClosedExercisesGrid } from './components/closed-exercises-grid'

export function EjerciciosPage() {
  const navigate = useNavigate()
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="flex h-full flex-col">
      <EjerciciosPageHeader />
      {showBanner && (
        <NotificationBanner
          onOpen={() => navigate('/ejercicios/mis-servicios')}
          onDismiss={() => setShowBanner(false)}
        />
      )}
      <CurrentExerciseSection />
      <NextExerciseSection />
      <ClosedExercisesGrid />
    </div>
  )
}
