import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Button, Icon } from '@/shared/ui'
import type { SavedConfig, SavedConfigData } from '../lib/saved-configs'
import { ConfiguracionesCargarPanel } from './configuraciones-cargar-panel'
import { ConfiguracionesGuardarPanel } from './configuraciones-guardar-panel'

interface ConfiguracionesButtonProps {
  savedConfigs: SavedConfig[]
  onLoad: (data: SavedConfigData) => void
  onSave: (name: string) => void
  onDelete: (name: string) => void
}

export function ConfiguracionesButton({ savedConfigs, onLoad, onSave, onDelete }: ConfiguracionesButtonProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'menu' | 'cargar' | 'guardar'>('menu')

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setMode('menu')
      }}
    >
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm">
          <Icon name="config" size={14} color="currentColor" /> Configuraciones
          <Icon name={open ? 'chevron_up' : 'chevron_down'} size={13} color="currentColor" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} className="z-[9100] min-w-[220px] overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_4px_20px_rgba(0,60,150,0.12)]">
          {mode === 'menu' && (
            <div className="flex flex-col">
              <button type="button" onClick={() => setMode('cargar')} className="border-b border-border p-[10px_16px] text-left text-[13px] text-foreground hover:bg-[#F4F7FE]">
                Cargar configuración
              </button>
              <button type="button" onClick={() => setMode('guardar')} className="p-[10px_16px] text-left text-[13px] text-foreground hover:bg-[#F4F7FE]">
                Guardar configuración
              </button>
            </div>
          )}
          {mode === 'cargar' && (
            <ConfiguracionesCargarPanel
              savedConfigs={savedConfigs}
              onLoad={(data) => {
                onLoad(data)
                setOpen(false)
              }}
              onDelete={onDelete}
            />
          )}
          {mode === 'guardar' && (
            <ConfiguracionesGuardarPanel
              onCancel={() => setMode('menu')}
              onSave={(name) => {
                onSave(name)
                setOpen(false)
              }}
            />
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
