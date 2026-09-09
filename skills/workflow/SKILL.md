---
name: workflow
description: Universal rigorous development workflow (FE, BE, Fullstack) following the mandatory 11-step lifecycle (Research -> Explore -> Plan -> Implement -> Test #1 -> Review -> Fix -> Simplify -> Test #2 -> Final Review -> Commit). MANDATES Playwright E2E tests for any UI-related task.
---

# Universal Development Workflow (FE / BE / Fullstack)

This skill enforces a disciplined, multi-phase development lifecycle for any engineering task.

The workflow accepts an optional mode argument `$ARGUMENTS`:
- **`fe` / `frontend`**: Frontend-only track (UI, Components, Routing, Client State)
- **`be` / `backend`**: Backend-only track (Database Schemas, Migrations, oRPC APIs, Auth)
- **`fullstack`** *(Default)*: End-to-end fullstack track (Database ➔ API ➔ UI ➔ E2E QA)

---

## 🚨 MANDATORY EXECUTION RULES

1. **MANDATORY DATABASE RULE (`db-architect`)**:
   - Whenever a task requires **creating, editing, or migrating database tables, schemas, relations, seed data, or running `drizzle-kit` commands**, you **MUST explicitly delegate to sub-agent `db-architect`** via `Agent` tool (`Agent({ subagent_type: 'db-architect', prompt: '...' })`).

2. **MANDATORY UI RULE (`tester-engineer` + Playwright)**:
   - Whenever a task creates, modifies, or refactors a UI component, page, form, or route, you **MUST author corresponding Playwright E2E tests** (in `e2e/<feature>.spec.ts` or `tests/e2e/<feature>.spec.ts`) and **MUST invoke sub-agent `tester-engineer`** to execute and verify them. A UI task is **INCOMPLETE** without working Playwright test coverage and verified passing test run.

---

## 🧭 Visual Lifecycle Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                           1. TASK                           │
│           (Clarify Requirements & Select Scope)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         2. RESEARCH                         │
│  ├─ Check package.json & installed library versions         │
│  ├─ Sub-agent `llm-reader` / `context7` for llms.txt & docs │
│  ├─ Review official changelogs & breaking changes           │
│  └─ Inspect existing codebase patterns & idioms             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         3. EXPLORE                          │
│  └─ Map dependencies, existing hooks, stores, schemas & APIs│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                          4. PLAN                            │
│  ├─ Implementation breakdown (DB / API / UI)                │
│  └─ [MANDATORY FOR UI] Playwright E2E test scenarios plan   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       5. IMPLEMENT                          │
│  ├─ FE: Delegate to `ui-builder` (skills: ui-module, antd,  │
│  │      shadcn, tanstack-router, zustand, hooks)            │
│  │      + Author Playwright E2E spec file                   │
│  ├─ BE: Delegate to `db-architect` & `orpc-developer`       │
│  │      (skills: drizzle, tanstack)                         │
│  └─ Fullstack: DB Schema ➔ oRPC Router ➔ UI Module ➔ E2E    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        6. TEST #1                           │
│  ├─ Typecheck (tsc --noEmit)                                │
│  ├─ Lint check & antd lint                                  │
│  ├─ Unit / Integration tests                                │
│  ├─ Build verification (next build / vite build)            │
│  └─ [MANDATORY FOR UI] Playwright E2E test run via          │
│     `tester-engineer` or `playwright` MCP                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         7. REVIEW                           │
│  ├─ Correctness & contract alignment                        │
│  ├─ Edge cases & error handling (ORPCError, fallback UI)    │
│  ├─ Security (Auth, Zod validation, SQL safety)             │
│  └─ Performance (N+1 queries, atomic selectors, bundle size)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  8. FIX REVIEW FINDINGS                     │
│  └─ Directly resolve all issues found during review         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       9. SIMPLIFY                           │
│  └─ Eliminate redundant abstractions, unused code & AI slop │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   10. TEST #2 (MANDATORY)                   │
│  ├─ Typecheck                                               │
│  ├─ Lint                                                    │
│  ├─ Unit & Regression tests                                 │
│  ├─ Build                                                   │
│  └─ [MANDATORY FOR UI] Re-run Playwright E2E test suite     │
│                                                             │
│  [IF FAILED] ──► Fix root cause ──► Re-run TEST #2          │
└──────────────────────────────┬──────────────────────────────┘
                               │ (All Green)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      11. FINAL REVIEW                       │
│  └─ Inspect git diff for clean, intentional changes         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         12. COMMIT                          │
│  └─ Conventional commit + Co-Authored-By attribution        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Execution Guide

### Step 1: TASK Analysis & Scope Selection
- Identify track from input `$ARGUMENTS` or user request:
  - **FE Only**: UI components, pages, forms, client routing, global state.
  - **BE Only**: Database tables, migrations, RPC procedures, auth middlewares.
  - **Fullstack**: End-to-end features integrating Database + API + UI.
- Define acceptance criteria and expected behavior.

---

### Step 2: RESEARCH
Gather accurate context before writing any code:
1. **Installed Versions**: Read `package.json` to verify framework versions (React 18/19 SPA / TanStack Start, TanStack Query/Router, oRPC, Drizzle, Shadcn UI, AntD, Better-Auth, Playwright).
2. **Official llms.txt & Docs**:
   - Spawn sub-agent **`llm-reader`** or query **`context7` MCP** (`mcp_context7_resolve_library_id` ➔ `mcp_context7_query_docs`).
   - For Ant Design: Run `antd info <Component> --format json` or use `antd` MCP.
   - For Shadcn: Use `shadcn` MCP to discover components.
3. **Changelogs**: Check for breaking changes or deprecations.
4. **Current Patterns**: Search codebase (`Grep`/`Glob`) to match existing project conventions.

---

### Step 3: EXPLORE
- Map relevant files, types, entities, and components using `Glob` and `Read`.
- Check available shared resources:
  - Custom Hooks: `src/hooks/` (`useAuth`, `useDebounce`, `useIsMobile`, `useDisclosure`, `useCopyToClipboard`).
  - Zustand Stores: `src/stores/`.
  - UI Primitives: `src/components/ui/`.
  - Database Schemas: `src/db/schema/`.
  - oRPC Routers: `src/orpc/router/`.
  - Existing E2E specs: `e2e/` or `tests/e2e/`.

---

### Step 4: PLAN
Create a concise, structured implementation plan:
- Outline exact file paths to create or modify.
- Detail data contracts (Zod schemas, types, Drizzle entities, oRPC procedures).
- Detail UI component hierarchy and state flow.
- **[FOR UI TASKS] Plan Playwright E2E test file**: Define test cases for initial rendering, form inputs, button clicks, validation errors, loading states, and success notifications.

---

### Step 5: IMPLEMENT
Execute implementation using specialized sub-agents and skills:

#### Option A: Frontend Track (`fe`)
- **Agent**: `ui-builder`
- **Skills**: `ui-module`, `shadcn`, `antd`, `tanstack-router`, `zustand`, `hooks`
- **Rules**:
  - Structure feature in `src/features/<feature-name>/` (`index.tsx`, `context/index.tsx`, `components/`).
  - Use ES6 Arrow functions (`export const Comp = (): React.ReactNode => ...`).
  - Use `react-hook-form` + `@hookform/resolvers/zod` for forms (`commands/form-zod.md`).
  - Integrate data fetching via `orpc.<router>.<method>.useQuery()`.
  - **MANDATORY**: Author Playwright E2E spec in `e2e/<feature-name>.spec.ts` covering the new UI flow.

#### Option B: Backend Track (`be`)
- **Agents**:
  - **`db-architect` (MUST DELEGATE for DB tasks)**: Create/edit schemas in `src/db/schema/<entity>.ts`, configure `relations`, export `drizzle-zod` schemas, and run `drizzle-kit generate/migrate`.
  - **`orpc-developer`**: Build oRPC routers in `src/orpc/router/<router>.ts` (`commands/crud-rpc.md`), `publicProcedure` / `protectedProcedure` with strict Zod input/output schemas.
- **Skills**: `drizzle`, `tanstack`
- **Commands**: `/drizzle-schema`, `/crud-rpc`, `/auth-setup`.

#### Option C: Fullstack Track (`fullstack`)
- Follow sequential assembly:
  1. **Database Layer (MUST DELEGATE to `db-architect`)**: Drizzle schema in `src/db/schema/` ➔ `drizzle-zod` ➔ `drizzle-kit` migration.
  2. **API Layer (`orpc-developer`)**: oRPC router ➔ procedures ➔ root router export.
  3. **UI Layer (`ui-builder`)**: Feature module ➔ context ➔ components ➔ route.
  4. **E2E Tests (`tester-engineer`)**: Author and verify Playwright E2E test suite in `e2e/<feature-name>.spec.ts`.

---

### Step 6: TEST #1 (First Quality Gate)
Run the initial verification suite via Bash:
1. **Typecheck**: `bun run typecheck` or `npx tsc --noEmit`
2. **Lint**: `bun run lint` or `npm run lint` (plus `antd lint` if AntD components were touched)
3. **Unit / Integration**: `bun test` or `npm test`
4. **Build**: `bun run build` or `npm run build`
5. **Playwright E2E & QA Delegation (MANDATORY FOR UI)**:
   - **MUST invoke sub-agent `tester-engineer`** via `Agent` tool (`Agent({ subagent_type: 'tester-engineer', prompt: 'Run Playwright E2E tests for <feature>, test browser UI flows, inspect console/network errors, and report results' })`).
   - `tester-engineer` runs `npx playwright test`, inspects DOM state, analyzes network payloads, and logs confirmed defects in `BUG.md`.
   - Alternatively utilize `playwright` MCP tools for interactive browser debugging.

---

### Step 7: MULTI-AXIS REVIEW
Review the changes across 4 core axes:
- **Correctness**: Are functional requirements met? Are contracts and types aligned?
- **Edge Cases**: Empty states, error boundaries, network retries, null checks.
- **Security**: Authentication verification, authorization middleware, input sanitization, no exposed secrets.
- **Performance**: Query efficiency, avoidance of N+1 queries, atomic Zustand selectors, bundle optimization.

---

### Step 8: FIX REVIEW FINDINGS
- Resolve all defects, warnings, or gaps found during Step 7.
- Re-verify code consistency with the project style guide.

---

### Step 9: SIMPLIFY
- Clean up dead code, redundant wrappers, unused imports, and verbose comments.
- Ensure code is lean, readable, and maintainable.

---

### Step 10: TEST #2 (MANDATORY QUALITY GATE)
**BẮT BUỘC** re-run all validation steps:
```bash
# Must run full validation including Playwright tests
npm run typecheck && npm run lint && npm test && npx playwright test && npm run build
```
- For UI changes, re-invoke **`tester-engineer`** to confirm that regression tests pass and all bugs in `BUG.md` are resolved.
- **If any test fails**: Diagnose root cause ➔ Fix ➔ Re-run Step 10 until 100% green.

---

### Step 11: FINAL REVIEW
- Run `git diff` to review all staged and unstaged changes.
- Ensure no accidental edits, unwanted files, or debugging logs are left.

---

### Step 12: COMMIT
- Create a clean Git commit using Conventional Commits format:
  ```bash
  git add <files>
  git commit -m "feat(<scope>): <description>

  Co-Authored-By: Claude Code <noreply@anthropic.com>"
  ```
