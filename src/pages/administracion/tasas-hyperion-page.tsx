import { useState } from 'react'
import { EJERCICIOS_CATALOGO, paisesConMoneda, tasasHyperionCatalogo } from '@/data/administracion-matrices'
import { Matriz12MesesPage } from './components/matriz-12-meses-page'

const monedaPorPais = Object.fromEntries(paisesConMoneda.map((p) => [p.pais, p.moneda]))

export function TasasHyperionPage() {
  const [ejercicio, setEjercicio] = useState(2027)
  const [data, setData] = useState(() => structuredClone(tasasHyperionCatalogo))

  return (
    <Matriz12MesesPage
      title="Tasas Hyperion"
      subtitle="Tasa oficial de consolidación por país y mes, usada para convertir la reportería a dólares"
      note="Unidades de moneda local por 1 USD. Un valor en 0 se interpreta como no configurado."
      ejercicio={ejercicio}
      ejercicios={EJERCICIOS_CATALOGO}
      onChangeEjercicio={setEjercicio}
      data={data[ejercicio] ?? {}}
      cellType="number"
      showMoneda={(pais) => monedaPorPais[pais]}
      onSaveFila={(pais, meses) =>
        setData((prev) => ({
          ...prev,
          [ejercicio]: { ...prev[ejercicio], [pais]: meses.map((v) => Number(v) || 0) },
        }))
      }
    />
  )
}
