export type ForecastNivel = 'n4' | 'n7'

/** Nivel al que se registra la justificación de desvío para el indicador de M5 — pendiente de
 * definición de negocio (puede terminar siendo N4 o N7). El envío a Control de Gestión (C11) ya no
 * depende de un nivel único: F: "Forecast N7 debe tener la misma funcionalidad que Forecast N4",
 * ambos ofrecen selección y envío masivo por igual (ver aplicarTransicionCdGBulk). */
export const FORECAST_JUSTIFICACION_NIVEL: ForecastNivel = 'n7'

/** Qué hacer con "Nuevo Forecast" cuando ya hay uno abierto (A2) — pendiente de validar con usuarios;
 * 'disabled' lo deja visible pero deshabilitado con tooltip, 'hidden' lo saca por completo. */
export type ForecastNuevoSinActivo = 'disabled' | 'hidden'
export const FORECAST_NUEVO_SIN_ACTIVO: ForecastNuevoSinActivo = 'disabled'
