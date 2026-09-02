export function SidebarTooltip({ label }: { label: string }) {
  return (
    <span
      className={
        'pointer-events-none absolute top-1/2 left-[calc(100%+10px)] z-[9999] -translate-x-1 -translate-y-1/2 ' +
        'rounded-md bg-[#1E2A4A] px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 ' +
        'shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-[opacity,transform] duration-150 ' +
        'group-hover:translate-x-0 group-hover:opacity-100'
      }
    >
      {label}
    </span>
  )
}
