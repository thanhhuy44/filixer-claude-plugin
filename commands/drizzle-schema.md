---
description: Generate a standardized Drizzle ORM table schema with drizzle-zod schemas in src/db/schema/<entity_name>.ts
---

Generate a Drizzle ORM table schema in `src/db/schema/<entity_name>.ts` matching the project's standard database entity pattern.

## Guidelines & Rules

1. **Location**:
   - Save table definitions under `src/db/schema/<entity_name>.ts`.
   - Re-export the schema in `src/db/schema/index.ts`.

2. **Standard Columns**:
   - `id`: Primary key using `uuid` (`defaultRandom()`).
   - `createdAt`: `timestamp('created_at', { mode: 'date' }).defaultNow().notNull()`.
   - `updatedAt`: `timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull()`.

3. **Validation & Types**:
   - Use `createSelectSchema` and `createInsertSchema` from `drizzle-zod`.
   - Export TypeScript types using `InferSelectModel` and `InferInsertModel`.

4. **Coding Style**:
   - Use ES6 Arrow Functions for default or computed column values.
   - Use camelCase for TS keys and snake_case for PostgreSQL database column names.

## Minimal Code Template

```ts
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

export const <entityName>Table = pgTable('<entity_name_plural>', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Zod Schemas for Validation (oRPC / Forms)
export const select<EntityName>Schema = createSelectSchema(<entityName>Table)
export const insert<EntityName>Schema = createInsertSchema(<entityName>Table, {
  name: (schema) => schema.name.min(1, 'Name is required'),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Infer Types
export type <EntityName> = InferSelectModel<typeof <entityName>Table>
export type New<EntityName> = InferInsertModel<typeof <entityName>Table>
```
