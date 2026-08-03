import { AiAssistantIcon } from './ai-assistant-icon'
import { AiAssistantPanel } from './ai-assistant-panel'
import { useAiAssistant } from './lib/use-ai-assistant'

export function AiAssistantButton() {
  const a = useAiAssistant()

  return (
    <>
      <AiAssistantIcon onClick={a.toggle} unread={a.minimized ? a.unread : 0} />
      {a.chatOpen && !a.minimized && (
        <AiAssistantPanel
          msgs={a.msgs}
          sugsHidden={a.sugsHidden}
          input={a.input}
          onInputChange={a.setInput}
          onSend={a.sendMsg}
          onMinimize={() => a.setMinimized(true)}
          onClose={() => {
            a.setChatOpen(false)
            a.setUnread(0)
          }}
          endRef={a.endRef}
        />
      )}
    </>
  )
}
