import type { ReactNode } from 'react'
import { Breadcrumb, Button, Icon, PageHeader, Pagination, SearchToolbar, Toast } from '@/shared/ui'
import { useCatalogoAdminPage } from '../lib/use-catalogo-admin-page'
import type { CatalogoFieldDef } from './catalogo-field'
import { CatalogoTable } from './catalogo-table'
import { CatalogoDrawer } from './catalogo-drawer'
import { ConfirmDeleteModal } from './confirm-delete-modal'

export interface CatalogoColumnDef<T> {
  key: keyof T & string
  label: string
  render?: (row: T) => ReactNode
  align?: 'left' | 'right'
}

interface CatalogoAdminPageProps<T extends { id: string }> {
  title: string
  subtitle: string
  seed: T[]
  columns: CatalogoColumnDef<T>[]
  fields: CatalogoFieldDef<T>[]
  searchKeys: (keyof T & string)[]
  buildRow: (values: Partial<T>) => T
  entityLabel: string
  allowDelete?: boolean
  pageSize?: number
}

const PAGE_SIZE_DEFAULT = 10

export function CatalogoAdminPage<T extends { id: string }>({
  title,
  subtitle,
  seed,
  columns,
  fields,
  searchKeys,
  buildRow,
  entityLabel,
  allowDelete = true,
  pageSize = PAGE_SIZE_DEFAULT,
}: CatalogoAdminPageProps<T>) {
  const p = useCatalogoAdminPage({ seed, fields, searchKeys, buildRow, entityLabel, pageSize })

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Administración', to: '/administracion' }, { label: title }]} />
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Button variant="primary" size="sm" onClick={p.openCreate}>
            <Icon name="plus" size={12} color="#fff" /> Nuevo registro
          </Button>
        }
      />

      <SearchToolbar value={p.s.query} onChange={p.s.setQuery} placeholder="Buscar registro..." resultCount={p.filtered.length} />

      <CatalogoTable rows={p.paged} columns={columns} allowDelete={allowDelete} onEdit={p.openEdit} onDelete={p.s.requestDelete} />

      <Pagination page={p.pageSafe} totalPages={p.totalPages} totalItems={p.filtered.length} pageSize={pageSize} onPageChange={p.s.setPage} itemLabel="registros" />

      <CatalogoDrawer
        title={title}
        open={p.s.drawerOpen}
        editing={Boolean(p.s.editing)}
        onClose={p.s.closeDrawer}
        fields={fields}
        form={p.form}
        onChangeField={(key, value) => p.setForm((f) => ({ ...f, [key]: value }))}
        canSubmit={p.canSubmit}
        onSubmit={p.submit}
      />

      <ConfirmDeleteModal open={p.s.deleteRow !== null} title={`¿Eliminar ${entityLabel.toLowerCase()}?`} onClose={p.s.cancelDelete} onConfirm={p.confirmDelete}>
        ¿Estás seguro de realizar esta acción? No se puede deshacer.
      </ConfirmDeleteModal>

      <Toast message={p.message} />
    </div>
  )
}
