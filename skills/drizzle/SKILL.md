---
name: drizzle
description: Standards and decision guide for Drizzle ORM, schema design, relations, drizzle-kit migrations, relational queries, and drizzle-zod integration.
---

# Drizzle ORM

Use this skill when designing database schemas, writing database migrations, building relational queries, or integrating Drizzle ORM with oRPC and Zod.

## 1. Core Guidelines

- **Mandatory Sub-Agent Delegation**: For all database schema creation, modification, relations, and `drizzle-kit` migrations, delegate to sub-agent **`db-architect`**.
- **Schema Organization**: Keep schemas modular under `src/db/schema/` and export them via `src/db/schema/index.ts`.
- **Naming Conventions**: Use `camelCase` for TypeScript variables/fields and `snake_case` for database table/column names.
- **Validation First**: Always generate Zod schemas via `drizzle-zod` (`createSelectSchema`, `createInsertSchema`) for use in oRPC procedures and form validations.
- **Relational Queries**: Prefer Drizzle Relational Queries API (`db.query.<table_name>.findMany(...)`) over manual `JOIN` queries when fetching nested data.

## 2. Standard Database Patterns

### Schema & Entity Definition

```ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))
```

## 3. Migration & Tooling Workflow (`drizzle-kit`)

- **Generate Migration**: Run `npx drizzle-kit generate` to create SQL migration files when schemas change.
- **Apply Migration**: Run `npx drizzle-kit migrate` to apply pending migrations to the target database.
- **Prototyping / Direct Push**: Run `npx drizzle-kit push` for rapid local development prototyping without generating migration files.
- **Studio Inspection**: Run `npx drizzle-kit studio` to inspect and edit database records via web visual interface.
