import { Icon } from '../icon'
import { AiAssistantMessages } from './ai-assistant-messages'
import { AiAssistantComposer } from './ai-assistant-composer'
import type { ChatMessage } from './ai-assistant-data'

interface AiAssistantPanelProps {
  msgs: ChatMessage[]
  sugsHidden: boolean
  input: string
  onInputChange: (v: string) => void
  onSend: (text: string) => void
  onMinimize: () => void
  onClose: () => void
  endRef: React.RefObject<HTMLDivElement | null>
}

export function AiAssistantPanel({ msgs, sugsHidden, input, onInputChange, onSend, onMinimize, onClose, endRef }: AiAssistantPanelProps) {
  return (
    <div className="fixed right-7 bottom-[98px] z-[9998] flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border-[0.5px] border-border bg-white shadow-[0_12px_48px_rgba(0,60,150,0.18)]">
      <div className="flex shrink-0 items-center gap-2.5 bg-[#0047CC] px-4 py-3">
        <Icon name="sparkles" size={18} color="#fff" />
        <span className="flex-1 text-sm font-semibold text-white">Asistente IA</span>
        <button type="button" onClick={onMinimize} className="flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15">
          <Icon name="minus" size={16} color="currentColor" />
        </button>
        <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15">
          <Icon name="x_close" size={16} color="currentColor" />
        </button>
      </div>
      <AiAssistantMessages msgs={msgs} endRef={endRef} />
      <AiAssistantComposer sugsHidden={sugsHidden} input={input} onInputChange={onInputChange} onSend={onSend} />
    </div>
  )
}
