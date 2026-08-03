import { useEffect, useRef, useState } from 'react'
import { AI_ANSWERS, AI_CHAT_STORAGE_KEY, AI_DEFAULT_ANSWER, type ChatMessage } from '../ai-assistant-data'

export function useAiAssistant() {
  const [chatOpen, setChatOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [msgs, setMsgs] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [unread, setUnread] = useState(0)
  const [sugsHidden, setSugsHidden] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(AI_CHAT_STORAGE_KEY)
      if (s) setMsgs(JSON.parse(s))
    } catch {}
  }, [])

  const scrollEnd = () => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  const sendMsg = (text: string) => {
    if (!text.trim()) return
    setSugsHidden(true)
    const userMsg: ChatMessage = { role: 'user', text: text.trim(), ts: Date.now() }
    const agentMsg: ChatMessage = { role: 'agent', text: AI_ANSWERS[text.trim()] || AI_DEFAULT_ANSWER, ts: Date.now() + 100 }
    const next = [...msgs, userMsg, agentMsg]
    setMsgs(next)
    try {
      sessionStorage.setItem(AI_CHAT_STORAGE_KEY, JSON.stringify(next))
    } catch {}
    setInput('')
    if (minimized) setUnread((u) => u + 1)
    else scrollEnd()
  }

  const openChat = () => {
    setChatOpen(true)
    setMinimized(false)
    setUnread(0)
    scrollEnd()
  }

  const toggle = () => ((chatOpen && !minimized) ? setMinimized(true) : openChat())

  return { chatOpen, minimized, msgs, input, setInput, unread, sugsHidden, endRef, sendMsg, toggle, setChatOpen, setMinimized, setUnread }
}
