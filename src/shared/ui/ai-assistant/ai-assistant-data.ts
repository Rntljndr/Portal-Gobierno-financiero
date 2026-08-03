export interface ChatMessage {
  role: 'user' | 'agent'
  text: string
  ts: number
}

export const AI_SUGGESTIONS = [
  '¿Cómo creo un PEP N4?',
  '¿Cómo envío a Control de Gestión?',
  '¿Que significa los diferentes estado?',
  '¿Como puedo levantar un incidente?',
]

export const AI_ANSWERS: Record<string, string> = {
  '¿Cómo creo un PEP N4?':
    'Dirígete a "Mis líneas presupuestarias", selecciona el PEP N3 correspondiente y presiona "Agregar N4". Completa el nombre, centro de costo y monto estimado.',
  '¿Cómo envío a Control de Gestión?':
    'Una vez completado tu presupuesto, presiona "Enviar a Control de Gestión" en la pantalla principal. El estado cambiará a "En revisión".',
  '¿Que significa los diferentes estado?':
    'Los estados del presupuesto son: "Borrador" (en edición), "En revisión" (enviado a Control de Gestión), "Aprobado" (validado) y "Rechazado" (requiere correcciones).',
  '¿Como puedo levantar un incidente?':
    'Para reportar un incidente, dirígete a la sección de Notificaciones y selecciona "Levantar incidente". Describe el problema y el sistema notificará al equipo de soporte.',
}

export const AI_DEFAULT_ANSWER = 'Estoy procesando tu consulta. Por el momento, consulta con el equipo de Control de Gestión.'

export const AI_CHAT_STORAGE_KEY = 'pgf-ai-chat-v1'
