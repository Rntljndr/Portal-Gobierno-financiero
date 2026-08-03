import { useRef, useState } from 'react'

export function useToast(durationMs = 4000) {
  const [message, setMessage] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setMessage(msg)
    timeoutRef.current = setTimeout(() => setMessage(null), durationMs)
  }

  return { message, showToast }
}
