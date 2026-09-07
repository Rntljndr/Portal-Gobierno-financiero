interface RealesCompareCheckProps {
  label: string
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
  border?: boolean
}

export function RealesCompareCheck({ label, hint, checked, onChange, border = true }: RealesCompareCheckProps) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 py-3 ${border ? 'border-b border-[#F1F4FB]' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-primary" />
      <div>
        <div className="text-[13px] font-semibold text-foreground">{label}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>
      </div>
    </label>
  )
}
