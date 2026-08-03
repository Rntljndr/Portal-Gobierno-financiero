export function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[11.5px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value || '—'}</div>
    </div>
  )
}
