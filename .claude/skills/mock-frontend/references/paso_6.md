# Paso 6 — Implementar Auditorías (opcional, usa el skill ui-audit)

Paso opcional: se ofrece cuando el paso 5 está completo, no se fuerza. Todo el análisis es del skill **`ui-audit`**; este paso solo IMPLEMENTA lo que esa skill produjo. Nunca generar ni completar hallazgos desde mock-frontend.

## Cómo interactuar con la skill ui-audit

1. **Condiciones para arrancar:** paso 5 al 100% + carpeta `ui-audits/<slug>-<fecha>/` generada sobre esa versión. Si se cambiaron pantallas después de la corrida, la carpeta está desactualizada.
2. **¿No hay carpeta (o está desactualizada)?** → hay que correr `ui-audit`:
   - Si el skill no está instalado, instalarlo: pedirle a la persona en lenguaje simple de dónde obtenerlo ("necesito la herramienta de auditoría ui-audit, ¿me pasas el zip o me dices de dónde tomarla?") y, con eso, dejarlo tú en `.claude/skills/ui-audit/`.
   - Correr `ui-audit` es una corrida propia, con su propio flujo y su pregunta de respaldo — no un atajo dentro de este paso.
3. **¿Hay carpeta?** → el input de trabajo es el `hallazgos.json` de cada categoría (el contrato completo lo define `ui-audit` en su `references/contrato-de-salida.md`; `preview.html` es solo referencia visual del antes/después).
4. **Repasar los hallazgos con la persona** en lenguaje de producto y confirmar cuáles implementar — puede elegir un subconjunto de las categorías que traiga la carpeta.
5. **Implementar** cada hallazgo aprobado siguiendo su `recomendacion` del JSON, en lotes por cluster/rol (no archivo por archivo). Orden sugerido: primero los hallazgos de flujo/función, al final los de mayor superficie de archivos.
6. **Cerrar cada categoría:** build sin errores + lint sin warnings + verificación visual en el navegador contra el `preview.html` + entrada de changelog legible. Marcar los hallazgos implementados como resueltos para no perder los pospuestos.
