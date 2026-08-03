import { iaAvatarSvg } from './ai-assistant-frames'
import type { ChatMessage } from './ai-assistant-data'

interface AiAssistantMessagesProps {
  msgs: ChatMessage[]
  endRef: React.RefObject<HTMLDivElement | null>
}

export function AiAssistantMessages({ msgs, endRef }: AiAssistantMessagesProps) {
  return (
    <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 py-3">
      {msgs.length === 0 && <div className="mt-5 text-center text-[13px] text-muted-foreground">¿En qué puedo ayudarte?</div>}
      {msgs.map((msg, i) => {
        const isUser = msg.role === 'user'
        return (
          <div key={i} className={`flex items-start ${isUser ? 'justify-end gap-0' : 'justify-start gap-2'}`}>
            {!isUser && <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full" dangerouslySetInnerHTML={{ __html: iaAvatarSvg }} />}
            <div
              className={`max-w-[82%] rounded-xl p-3 text-[13px] leading-relaxed ${isUser ? 'bg-[#0073FF] text-white' : 'bg-[#F0F4FA] text-foreground'}`}
            >
              {msg.text}
            </div>
          </div>
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
