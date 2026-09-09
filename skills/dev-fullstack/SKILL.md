---
name: dev-fullstack
description: Complete end-to-end fullstack development workflow following the 11-step lifecycle (Research -> Explore -> Plan -> Implement -> Test #1 -> Review -> Fix -> Simplify -> Test #2 -> Final Review -> Commit) coordinating DB Architect, oRPC Developer, UI Builder, and Tester Engineer with MANDATORY Playwright E2E tests.
---

# Fullstack Development Workflow (`dev-fullstack`)

Comprehensive end-to-end fullstack workflow coordinating all specialized sub-agents, skills, and tools across the mandatory 11-step lifecycle with **MANDATORY Playwright E2E testing**.

---

## 🚨 MANDATORY ARCHITECTURAL RULES

1. **MANDATORY DATABASE DELEGATION (`db-architect`)**:
   - Whenever creating, editing, or migrating database tables, schemas, relations, seed data, or running `drizzle-kit` commands, you **MUST explicitly delegate to sub-agent `db-architect`**.

2. **MANDATORY PLAYWRIGHT E2E TESTING (`tester-engineer`)**:
   - Whenever fullstack features touch the UI, you **MUST author corresponding Playwright E2E tests** (`e2e/<feature>.spec.ts`) and **MUST invoke sub-agent `tester-engineer`** to execute and verify them.

---

## 🚀 End-to-End Fullstack Execution

### 1. TASK
- Gather full feature requirements: database persistence, API business logic, UI user experience, authentication, and E2E validation.

### 2. RESEARCH
- Inspect `package.json` for fullstack dependencies (Next.js/Vite, TanStack, oRPC, Drizzle, Shadcn UI, AntD, Better-Auth, Playwright).
- Spawn **`llm-reader`** or use **`context7` MCP** to fetch official specs for relevant technologies.
- Inspect changelogs and existing project patterns.

### 3. EXPLORE
- Map existing entities in `src/db/schema/`, API endpoints in `src/orpc/router/`, and feature modules in `src/features/`.
- Identify shared hooks (`src/hooks/`), stores (`src/stores/`), and UI primitives (`src/components/ui/`).
- Inspect `e2e/` for test fixtures and utilities.

### 4. PLAN
- **Database**: Table schema, relations, migration plan.
- **Backend API**: oRPC procedures, Zod input/output validation, auth protection.
- **Frontend UI**: Feature module structure (`src/features/<feature>/`), form state, query hooks.
- **E2E Testing (MANDATORY)**: Define Playwright E2E test scenarios covering happy path, validation errors, and authorization guards.

### 5. IMPLEMENT (Coordinated Assembly)
1. **Database Layer** (`db-architect` agent + `drizzle` skill):
   - Define schema in `src/db/schema/<entity>.ts`.
   - Export Zod schemas with `drizzle-zod`.
   - Run `npx drizzle-kit generate` & `npx drizzle-kit migrate`.
2. **API Layer** (`orpc-developer` agent + `tanstack` skill):
   - Create router in `src/orpc/router/<entity>.ts` with CRUD operations.
   - Attach `publicProcedure` / `protectedProcedure`.
   - Register in root app router.
3. **UI Layer** (`ui-builder` agent + `ui-module`, `shadcn`, `antd` skills):
   - Create `src/features/<feature>/` (`index.tsx`, `context/`, `components/`).
   - Connect API using `orpc.<entity>.*.useQuery()` & `useMutation()`.
   - Invalidate queries on mutation success.
4. **E2E Test Suite (MANDATORY)**:
   - Author Playwright test in `e2e/<feature>.spec.ts` testing the complete user journey.

### 6. TEST #1 (First Quality Gate)
- Run `npm run typecheck` (`tsc --noEmit`).
- Run `npm run lint`.
- Run unit & integration tests: `npm test`.
- Run full application build: `npm run build`.
- **Run Playwright E2E Suite & QA Delegation**:
  - **MUST invoke sub-agent `tester-engineer`** via `Agent` tool (`Agent({ subagent_type: 'tester-engineer', prompt: 'Execute Playwright fullstack E2E tests in e2e/<feature>.spec.ts, inspect browser interactions, verify API response payloads, and check console errors' })`).
  - `tester-engineer` runs the tests, checks database state mutations triggered from UI, and logs defects in `BUG.md`.
- Confirm all user interactions and assertions succeed in the real browser.

### 7. REVIEW
- Check complete flow: User interaction ➔ API request ➔ Database persistence ➔ UI state update.
- Verify security (Auth checks, input sanitization).
- Verify edge cases (empty states, loading spinners, network errors).
- Verify performance (no unnecessary re-renders, indexed DB queries).

### 8. FIX REVIEW FINDINGS
- Resolve all discovered bugs, UI flaws, or type mismatches.

### 9. SIMPLIFY
- Clean up dead code, redundant wrappers, and verbose comments.

### 10. TEST #2 (MANDATORY GATE)
- Re-run full verification including Playwright tests via `tester-engineer`:
  ```bash
  npm run typecheck && npm run lint && npm test && npx playwright test && npm run build
  ```
- Re-verify with `tester-engineer` that all regression tests pass and all bugs logged in `BUG.md` are resolved.
- If any check fails: Fix ➔ Re-run TEST #2 until 100% green.

### 11. FINAL REVIEW & COMMIT
- Run `git diff` to review all fullstack changes.
- Commit using Conventional Commits with attribution.
