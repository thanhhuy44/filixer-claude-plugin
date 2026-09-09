# Filixer Claude Plugin — Agent Operating Guidelines

This repository is the official **Filixer Fullstack Plugin** for Claude Code, equipping agents with specialized sub-agents, skills, slash commands, MCP servers, and lifecycle hooks for React SPA / TanStack Start (SSR support), TanStack, oRPC, Drizzle ORM, Shadcn UI, Ant Design, Better-Auth, and Playwright.

---

## ⚡ Quick Reference: Resource Routing Matrix

When handling tasks, agents must route actions to the appropriate specialized sub-agents, skills, or MCP tools:

| Task Type | Primary Sub-Agent | Relevant Skill (`Skill` tool) | MCP Server / Tooling | Slash Command |
| :--- | :--- | :--- | :--- | :--- |
| **Unified Development Lifecycle** | Orchestrator | `workflow`, `dev-fullstack`, `dev-frontend`, `dev-backend` | `context7`, `playwright` | `/filixer:workflow` |
| **Database & Schema** | `db-architect` | `drizzle` | - | `/drizzle-schema` |
| **Backend & APIs** | `orpc-developer` | `tanstack` (Query oRPC) | - | `/crud-rpc`, `/auth-setup` |
| **Feature UI & Forms** | `ui-builder` | `ui-module`, `shadcn`, `antd` | `shadcn`, `antd` | `/feature-ui`, `/form-zod`, `/feature-auth-ui` |
| **SPA Routing** | `ui-builder` | `tanstack-router` | - | `/spa-route`, `/spa-auth-client` |
| **Global State** | `ui-builder` | `zustand` | - | - |
| **Custom Hooks** | `ui-builder` | `hooks` | - | - |
| **Testing & QA** | `tester-engineer` | - | `playwright` | - |
| **Docs & Official LLM Specs** | `llm-reader` | - | `context7`, `WebSearch`, `WebFetch` | - |

---

## 🔄 Mandatory 11-Step Development Workflow

All development tasks (FE, BE, Fullstack) must strictly follow this lifecycle:

```text
TASK ──► RESEARCH ──► EXPLORE ──► PLAN ──► IMPLEMENT ──► TEST #1 ──► REVIEW ──► FIX ──► SIMPLIFY ──► TEST #2 (MANDATORY) ──► FINAL REVIEW ──► COMMIT
                                                                                                           │ (IF FAILED)
                                                                                                           └──► FIX ──► RE-RUN TEST #2
```

1. **TASK**: Clarify track (FE / BE / Fullstack) and requirements.
2. **RESEARCH**: Inspect installed packages, check `llms.txt` via `llm-reader` / `context7`, check changelogs, review existing idioms.
3. **EXPLORE**: Use `Glob` & `Read` to map related schemas, routers, hooks, and UI components.
4. **PLAN**: Formulate step-by-step strategy with exact file paths and contracts.
5. **IMPLEMENT**: Delegate to specialized sub-agents (**must delegate to `db-architect` for any database schema/migration tasks**, `orpc-developer` for APIs, `ui-builder` for UI).
6. **TEST #1**: Initial validation (Typecheck, Lint, Tests, Build, and **must spawn sub-agent `tester-engineer`** for Playwright E2E UI verification).
7. **REVIEW**: Multi-axis evaluation (Correctness, Edge cases, Security, Performance).
8. **FIX**: Resolve all review findings.
9. **SIMPLIFY**: Remove redundant code, eliminate AI slop comments, ensure code hygiene.
10. **TEST #2 (BẮT BUỘC)**: Re-run full test suite (`typecheck && lint && test && playwright && build`) and verify all regressions with **`tester-engineer`**. If fail, fix and re-run.
11. **FINAL REVIEW & COMMIT**: Verify `git diff` and commit with Conventional Commits + Co-authored attribution.

---

## 🛠️ MCP Servers Usage Rules

1. **`antd`** (`@ant-design/cli`):
   - Always query component API props/tokens before writing Ant Design code (`antd info <Component> --format json`).
   - Use `antd lint <path> --format json` to verify changes.
2. **`shadcn`** (`shadcn@latest mcp`):
   - Use for component lookup, schema verification, and registry installation (`npx -y shadcn@latest add <component>`).
3. **`playwright`** (`@playwright/mcp@latest`):
   - Used by `tester-engineer` for browser navigation, snapshot verification, console error detection, and visual regression.
4. **`context7`**:
   - Use `mcp_context7_resolve_library_id` and `mcp_context7_query_docs` to fetch up-to-date documentation for React, TanStack Start/Router, oRPC, Better-Auth, Drizzle, Shadcn, and Tailwind.

---

## 🏗️ Architecture & Directory Conventions

### 1. Feature-Driven UI Modules (`src/features/<feature-name>/`)
```text
src/features/<feature_name>/
├── index.tsx                  # Feature Page component (wraps view in ContextProvider)
├── context/
│   └── index.tsx              # Context Provider & custom use<FeatureName>Context hook
└── components/                # Focused sub-components consuming context
    ├── list.tsx               # Minimal Data List / Table component
    ├── card.tsx               # Minimal Detail View / Card component
    ├── create-form.tsx        # Minimal Create Form component
    └── delete.tsx             # Minimal Delete Confirmation modal/button
```

### 2. Backend & oRPC Procedures (`src/orpc/`)
- Place routers in `src/orpc/router/<router_name>.ts` and compose into root router.
- Use `publicProcedure` for unauthenticated endpoints; `protectedProcedure` for session-authenticated endpoints.
- Standard CRUD methods: `getAll`, `getById`, `create`, `update`, `delete`.
- Return errors using `ORPCError` with standard HTTP-equivalent codes (`UNAUTHORIZED`, `NOT_FOUND`, `BAD_REQUEST`).

### 3. Database & Schemas (`src/db/`)
- **Mandatory Delegation**: Any creation, modification, or migration of database tables MUST be delegated to sub-agent **`db-architect`**.
- Place table definitions in `src/db/schema/<entity_name>.ts` and export via `src/db/schema/index.ts`.
- Database table & column names: `snake_case` (e.g. `user_profiles`, `created_at`).
- TypeScript variables & schema fields: `camelCase` (e.g. `userProfiles`, `createdAt`).
- Generate Zod schemas with `drizzle-zod` (`createSelectSchema`, `createInsertSchema`).
- Use `relations` for relational data mapping and Drizzle Relational Queries (`db.query.*`).

### 4. Client Routing (`src/routes/` for SPA)
- Use `@tanstack/react-router` with `createFileRoute('/path')`.
- Validate search parameters with Zod via `validateSearch`.
- Preload data using `loader` functions.

### 5. Client State (`src/stores/` & `src/hooks/`)
- Place domain-focused Zustand stores in `src/stores/<store-name>.ts` with atomic selectors and `persist` middleware when appropriate.
- Place reusable custom hooks in `src/hooks/use-<name>.ts` (e.g. `useAuth`, `useDebounce`, `useIsMobile`, `useDisclosure`, `useCopyToClipboard`).

---

## 📜 Code Style & Quality Standards

- **ES6 Arrow Functions Only**: Always use `export const ComponentName = (): React.ReactNode => ...` for React components. Do NOT use `function ComponentName()`.
- **Strict TypeScript**: Explicit return types and prop interfaces. Never use `any`.
- **Zero Mock UI**: Do not leave fake placeholder buttons or mock data arrays in production code unless explicitly requested.
- **Form Standard**: Always use `react-hook-form` + `@hookform/resolvers/zod` + Zod schema validation.
- **Styling**: Tailwind CSS with `cn()` utility (`clsx` + `tailwind-merge`) in `src/lib/utils.ts`.

---

## 🧪 Testing & Bug Resolution Workflow

1. **Mandatory Playwright E2E Tests for UI Tasks**: Whenever any UI component, page, form, or route is created or updated, you **MUST author corresponding Playwright E2E test specs** in `e2e/<feature>.spec.ts` (or `tests/e2e/<feature>.spec.ts`) and run them with `npx playwright test` or `playwright` MCP. A UI task is **INCOMPLETE** without passing Playwright test verification.
2. **Test Strategy**: Prioritize critical user flows, authentication, CRUD operations, and error handling.
3. **Playwright Automation**: Run Playwright tests via `tester-engineer` agent or npm scripts (`bun test` / `npx playwright test`).
4. **Bug Tracking**: Document any confirmed defects in `BUG.md` using the standard `BUG-XXX` format with steps to reproduce, expected/actual outcomes, root cause, and regression tests.
5. **Verification**: Always re-verify fixes with regression tests before marking tasks completed.

---

## 🪝 Lifecycle Hooks & Safety Rules

- **PreToolUse Safety**: Dangerous commands (`git push --force`, `rm -rf /`, `DROP DATABASE`, `TRUNCATE TABLE`) are intercepted and blocked automatically.
- **PostToolUse Auto-Format**: `.ts`, `.tsx`, and `.json` files are automatically formatted via Prettier upon edit/write.
- **Session Readiness**: Ensure dependencies are installed (`bun install` / `npm install`) and required `.env` variables are configured before running tasks.
