---
name: tanstack
description: Standards and decision guide for TanStack Query (React Query) oRPC integration, query invalidation, caching strategies, and TanStack Table implementation.
---

# TanStack Query & Table

Use this skill when fetching data, managing async cache, handling mutations with oRPC, or building complex data tables with TanStack primitives.

## 1. Core Guidelines

- **oRPC + TanStack Query**: Always use oRPC React Query integration hooks for client-side data fetching and mutation handling (`orpc.<router>.<method>.useQuery()`, `orpc.<router>.<method>.useMutation()`).
- **Query Invalidation**: Invalidate relevant queries after successful mutations (`utils.<router>.<method>.invalidate()`).
- **TanStack Table**: Use `@tanstack/react-table` for data grid views that require custom column sorting, pagination, or filtering.

## 2. Code Patterns

### Data Fetching & Mutation with oRPC

```tsx
import { orpc } from '@/lib/orpc'
import { useQueryClient } from '@tanstack/react-query'

export const ItemList = (): React.ReactNode => {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = orpc.item.getAll.useQuery({ page: 1, limit: 10 })

  const deleteMutation = orpc.item.delete.useMutation({
    onSuccess: () => {
      // Invalidate query to refetch fresh data
      orpc.item.getAll.invalidate()
    },
  })

  if (isLoading) return <div>Loading items...</div>
  if (error) return <div>Error loading items</div>

  return (
    <ul>
      {data?.data.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => deleteMutation.mutate({ id: item.id })}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

### TanStack Data Table Basics

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export const DataTable = <TData, TValue>({
  columns,
  data,
}: Props<TData, TValue>): React.ReactNode => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```
