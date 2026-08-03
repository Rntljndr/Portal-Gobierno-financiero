import { Icon } from './icon'

export function Toast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-[9500] flex -translate-x-1/2 items-center gap-2.5 rounded-xl bg-[#1F2A44] px-4 py-3 text-[13px] font-medium text-white shadow-[0_8px_24px_rgba(6,20,148,0.24)]">
      <Icon name="check" size={15} color="#4ADE80" />
      {message}
    </div>
  )
}
