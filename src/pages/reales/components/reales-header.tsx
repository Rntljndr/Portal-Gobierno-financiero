import { Breadcrumb, Button, Icon, PageHeader } from '@/shared/ui'

interface RealesHeaderProps {
  syncing: boolean
  onSync: () => void
}

export function RealesHeader({ syncing, onSync }: RealesHeaderProps) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Reales' },
        ]}
      />
      <PageHeader
        title="Reales"
        subtitle="Consulta de ejecución presupuestaria y movimientos contables"
        action={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11.5px] text-muted-foreground">
              <Icon name="check" size={11} color="#8A90A2" /> Actualizado · Hace 5 min
            </span>
            <Button variant="outline" size="sm" onClick={onSync} disabled={syncing}>
              {syncing ? (
                <>
                  <div className="size-3 animate-spin rounded-full border-2 border-border-strong border-t-primary" /> Sincronizando...
                </>
              ) : (
                <>
                  <Icon name="play" size={11} color="#0047B0" /> Sincronizar SAP
                </>
              )}
            </Button>
          </div>
        }
      />
    </>
  )
}
