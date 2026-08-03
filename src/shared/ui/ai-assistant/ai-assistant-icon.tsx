import { useRef } from 'react'
import { iaAgentCss, iaFramesHtml } from './ai-assistant-frames'
import { useIaIconAnimation } from './lib/use-ia-icon-animation'

interface AiAssistantIconProps {
  onClick: () => void
  unread: number
}

export function AiAssistantIcon({ onClick, unread }: AiAssistantIconProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const framesRef = useRef<HTMLDivElement>(null)
  useIaIconAnimation({ framesRef, btnRef })

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label="Asistente IA"
      className="fixed right-7 bottom-[42px] z-[9999] h-[52px] w-[52px] cursor-pointer border-none bg-transparent p-0 outline-none"
    >
      <style>{iaAgentCss}</style>
      {/* SVG animation frames from the reference asset — injected raw to avoid manual transcription errors */}
      <div ref={framesRef} className="absolute inset-0" dangerouslySetInnerHTML={{ __html: iaFramesHtml }} />

      {unread > 0 && (
        <div className="absolute -top-[3px] -right-[3px] z-[1] flex h-3 w-3 items-center justify-center rounded-full border-[1.5px] border-white bg-[#e53e3e] text-[7px] font-bold text-white">
          {unread}
        </div>
      )}
    </button>
  )
}
