---
name: dev-backend
description: Backend-specific development workflow following the 11-step lifecycle (Research -> Explore -> Plan -> Implement -> Test #1 -> Review -> Fix -> Simplify -> Test #2 -> Final Review -> Commit) with MANDATORY DB Architect delegation for create/edit/migrate db tasks, oRPC Developer, Drizzle ORM, and Better-Auth.
---

# Backend Development Workflow (`dev-backend`)

Specialized backend engineering workflow adhering to the mandatory 11-step quality lifecycle and **MANDATORY DB Architect delegation**.

---

## 🚨 MANDATORY DATABASE RULE: DB ARCHITECT DELEGATION
> **NON-NEGOTIABLE RULE**: Whenever a backend or fullstack task requires **creating, editing, or migrating database tables, schemas, relations, seed data, or running `drizzle-kit` commands**, the main agent **MUST explicitly delegate the database operations to sub-agent `db-architect`** via the `Agent` tool (`Agent({ subagent_type: 'db-architect', prompt: '...' })`).

---

## 🚀 Specialized Backend Workflow

### 1. TASK
- Clarify data models, relationships, database operations (create/edit/migrate), API contracts, authorization rules, and error conditions.

### 2. RESEARCH
- Check `package.json` for Drizzle ORM, oRPC, Zod, and Better-Auth versions.
- Use **`context7` MCP** or **`llm-reader`** agent for official docs:
  - Drizzle ORM: `https://orm.drizzle.team/llms.txt`
  - oRPC: `https://orpc.dev/llms.txt`
  - Zod: `https://zod.dev/llms.txt`
  - Better-Auth: `https://better-auth.com/llms.txt`

### 3. EXPLORE
- Inspect `src/db/schema/` for existing database tables and relations.
- Inspect `src/orpc/router/` for existing routers and procedures.
- Check `src/lib/auth.ts` and `src/orpc/procedure.ts` for authentication middlewares.

### 4. PLAN
- **Database Schema Plan**: Table definitions, primary keys, audit timestamps, foreign keys, cascade deletes, indices, and `relations`.
- **Migration Strategy**: Step-by-step plan for `drizzle-kit generate` and `drizzle-kit migrate`.
- **Zod Schema Plan**: `drizzle-zod` select & insert schemas.
- **oRPC Plan**: Router definition, `publicProcedure` vs `protectedProcedure`, input/output contracts, and standard CRUD endpoints (`getAll`, `getById`, `create`, `update`, `delete`).

### 5. IMPLEMENT
- **Database Operations (MANDATORY DELEGATION)**:
  - **MUST delegate to sub-agent `db-architect`** via `Agent` tool (`Agent({ subagent_type: 'db-architect', prompt: 'Create/modify Drizzle schema in src/db/schema/<entity>.ts, export in index.ts, export drizzle-zod schemas, and generate/apply migrations via drizzle-kit' })`).
  - `db-architect` applies naming rules (`snake_case` in SQL / columns, `camelCase` in TS), sets up `relations`, and executes `npx drizzle-kit generate` & `npx drizzle-kit migrate`.
- **API Operations**:
  - Delegate to sub-agent **`orpc-developer`** to build type-safe procedures in `src/orpc/router/<router>.ts`, handle errors with `ORPCError`, and register router in root router.
- **Skills**: `drizzle`, `tanstack`
- **Commands**: `/drizzle-schema`, `/crud-rpc`, `/auth-setup`.

### 6. TEST #1
- Run typecheck: `npm run typecheck` (`tsc --noEmit`).
- Run linter: `npm run lint`.
- Run backend unit/integration tests: `npm test`.
- Verify database migrations: `npx drizzle-kit check`.

### 7. REVIEW
- **Correctness**: Validate database constraints, foreign keys, nullability, and procedure return types.
- **Security**: Verify session checks in `protectedProcedure`, prevent unauthorized data access, ensure no SQL injection.
- **Performance**: Optimize database queries, avoid N+1 queries with Drizzle Relational Queries (`db.query.*`), add indices on frequently filtered columns.

### 8. FIX REVIEW FINDINGS
- Fix any schema inconsistencies, type errors, or security gaps (re-invoke `db-architect` if schema changes are needed).

### 9. SIMPLIFY
- Refactor repetitive query logic, remove unneeded middleware layers, clean up unused imports.

### 10. TEST #2 (BẮT BUỘC)
- Re-run full verification:
  ```bash
  npm run typecheck && npm run lint && npm test && npm run build
  ```
- If failed: Fix ➔ Re-run TEST #2 until all green.

### 11. FINAL REVIEW & COMMIT
- Run `git diff` to inspect changes.
- Commit with conventional format and attribution.
