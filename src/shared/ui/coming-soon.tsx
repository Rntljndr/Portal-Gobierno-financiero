interface ComingSoonProps {
  title: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <span>{title} — próximamente</span>
    </div>
  )
}
