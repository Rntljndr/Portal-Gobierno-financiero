import { Button, Spinner } from '@/shared/ui'

interface RealesCompareFooterProps {
  applying: boolean
  onLimpiar: () => void
  onAplicar: () => void
}

export function RealesCompareFooter({ applying, onLimpiar, onAplicar }: RealesCompareFooterProps) {
  return (
    <>
      <Button variant="outline" onClick={onLimpiar} disabled={applying} className="disabled:opacity-50">
        Limpiar
      </Button>
      <Button variant="primary" onClick={onAplicar} disabled={applying} className="disabled:opacity-50">
        {applying ? (
          <span className="flex items-center gap-2">
            <Spinner size={4} className="border-white/40 border-t-white" /> Aplicando...
          </span>
        ) : (
          'Aplicar'
        )}
      </Button>
    </>
  )
}
