import { useState } from 'react'
import { EJERCICIOS_CATALOGO, fechasCierreSapCatalogo } from '@/data/administracion-matrices'
import { Matriz12MesesPage } from './components/matriz-12-meses-page'

export function FechasCierreSapPage() {
  const [ejercicio, setEjercicio] = useState(2027)
  const [data, setData] = useState(() => structuredClone(fechasCierreSapCatalogo))

  return (
    <Matriz12MesesPage
      title="Fechas de cierre SAP"
      subtitle="Fecha en que SAP cierra contablemente cada país y mes; se muestra en Preliminares como referencia"
      note="Son informativas: no habilitan ni bloquean el cierre de mes. Un mes sin fecha es normal, SAP publica su calendario por tramos."
      ejercicio={ejercicio}
      ejercicios={EJERCICIOS_CATALOGO}
      onChangeEjercicio={setEjercicio}
      data={data[ejercicio] ?? {}}
      cellType="date"
      onSaveFila={(pais, meses) =>
        setData((prev) => ({
          ...prev,
          [ejercicio]: { ...prev[ejercicio], [pais]: meses.map((v) => (v ? String(v) : null)) },
        }))
      }
    />
  )
}
