import { cn } from '@/shared/lib/utils'

/** Loader circular reutilizado en toda la herramienta (mismo patrón que BulkUploadDrawer/EnviarCdGModal). */
export function Spinner({ size = 4, className }: { size?: 4 | 8; className?: string }) {
  return <div className={cn('animate-spin rounded-full border-border-strong border-t-primary', size === 4 ? 'size-4 border-2' : 'size-8 border-[3px]', className)} />
}
