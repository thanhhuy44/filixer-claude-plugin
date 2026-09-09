---
description: Generate a type-safe TanStack Router client file route in src/routes/<path>.tsx
---

Generate a TanStack Router client route in `src/routes/<path>.tsx` matching the project's SPA routing pattern.

## Guidelines & Rules

1. **Imports**:
   - Use `createFileRoute` from `@tanstack/react-router`.
   - Import `z` from `'zod'` for search validation if applicable.

2. **Structure**:
   - Call `createFileRoute('/route-path')({...})`.
   - Optional `validateSearch` for type-safe search parameters.
   - Component rendering using ES6 Arrow Functions.

## Minimal Code Template

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  query: z.string().optional().default(''),
})

export const Route = createFileRoute('/<path>')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

const RouteComponent = () => {
  const { query } = Route.useSearch()

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Route: /<path></h1>
      {query && <p>Search Query: {query}</p>}
    </div>
  )
}
```
