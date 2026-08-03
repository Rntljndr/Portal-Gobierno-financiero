import { Icon } from '../icon'
import { AI_SUGGESTIONS } from './ai-assistant-data'

interface AiAssistantComposerProps {
  sugsHidden: boolean
  input: string
  onInputChange: (v: string) => void
  onSend: (text: string) => void
}

export function AiAssistantComposer({ sugsHidden, input, onInputChange, onSend }: AiAssistantComposerProps) {
  return (
    <>
      {!sugsHidden && (
        <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-border px-3 pt-2 pb-1.5">
          {AI_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSend(s)}
              className="rounded-full border-[0.5px] border-[#A0C4FF] bg-[#E4F0FF] px-3 py-1.5 text-left text-xs text-[#0047B0]"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex shrink-0 items-center gap-2 border-t border-border p-3">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend(input)}
          className="h-9 flex-1 rounded-lg border border-border px-2.5 text-[13px] outline-none"
        />
        <button
          type="button"
          onClick={() => onSend(input)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0073FF] text-white"
        >
          <Icon name="send" size={16} color="currentColor" />
        </button>
      </div>
    </>
  )
}
