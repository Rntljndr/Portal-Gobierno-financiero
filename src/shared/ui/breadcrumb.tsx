import { Fragment } from 'react'
import { Link } from 'react-router'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 px-8 pt-[18px] text-[12.5px] text-muted-foreground">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <span className="text-slate-300">›</span>}
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-primary hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{item.label}</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
