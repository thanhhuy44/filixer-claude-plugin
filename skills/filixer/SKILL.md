---
name: filixer
description: Core architecture guidelines and task routing matrix for building fullstack applications with React 19 SPA, TanStack Start (SSR support), TanStack Router/Query, oRPC, Drizzle ORM, Shadcn UI, Ant Design, Better-Auth, Zustand, and Playwright. Use when architecting features, setting up conventions, or coordinating sub-agents.
---

# Filixer Fullstack Architecture & Task Routing

Use this skill to navigate the architecture, coding standards, and sub-agent/skill delegation when building fullstack applications with the Filixer stack.

---

## ⚡ Task Routing Matrix

| Task Area                                  | Primary Agent                   | Specialized Skill                                          | Slash Command / Tool                           |
| :----------------------------------------- | :------------------------------ | :--------------------------------------------------------- | :--------------------------------------------- |
| **Development Workflow (FE/BE/Fullstack)** | Orchestrator                    | `workflow`, `dev-frontend`, `dev-backend`, `dev-fullstack` | `/filixer:workflow`                            |
| **Database & Migrations**                  | `db-architect`                  | `drizzle`                                                  | `/drizzle-schema`, `drizzle-kit`               |
| **Backend & oRPC APIs**                    | `orpc-developer`                | `tanstack` (Query oRPC)                                    | `/crud-rpc`, `/auth-setup`                     |
| **Feature UI & Forms**                     | `ui-builder`                    | `ui-module`, `shadcn`, `antd`                              | `/feature-ui`, `/form-zod`, `/feature-auth-ui` |
| **SPA Client Routing**                     | `ui-builder`                    | `tanstack-router`                                          | `/spa-route`, `/spa-auth-client`               |
| **Client State Management**                | `ui-builder`                    | `zustand`                                                  | Store files in `src/stores/`                   |
| **Custom React Hooks**                     | `ui-builder`                    | `hooks`                                                    | Hook files in `src/hooks/`                     |
| **Testing & QA (Playwright E2E)**          | `tester-engineer` (MUST INVOKE) | -                                                          | `playwright` MCP, `BUG.md`                     |
| **Live Docs / llms.txt**                   | `llm-reader`                    | -                                                          | `WebSearch`, `WebFetch`, `context7`            |

---

## 🚨 Mandatory Testing Rule

- For all UI / Fullstack changes, **MUST spawn sub-agent `tester-engineer`** via `Agent` tool to execute Playwright E2E tests, inspect DOM rendering, test user interactions, and verify zero unhandled console/network errors.

---

## 🏛️ Directory & Code Standards

1. **Feature UI (`src/features/<feature-name>/`)**:
   - Container `index.tsx` wraps page content in `ContextProvider`.
   - `schema.ts`: Zod validation schemas & body types (Shared Core).
   - `query.ts`: TanStack Query & Mutation options factory (`getAll`, `getOne`, `create`, `edit`, `delete`) (Shared Core).
   - `context/index.tsx`: Feature Context managing action state (`"create" | "edit" | "delete" | null`), `current` entity, queries, mutations, and exposes custom `use<FeatureName>Context()` (Shared Core).
   - Modular components in `components/`: `table.tsx`, `columns.tsx`, `actions-cell.tsx`, and `modals/upsert.tsx` (Supports both **Ant Design** and **Shadcn UI**).

2. **oRPC Procedures (`src/orpc/`)**:
   - Separate `publicProcedure` and `protectedProcedure`.
   - Standard CRUD: `getAll`, `getById`, `create`, `update`, `delete`.
   - Strict Zod input & output schemas. Return `ORPCError` for handled failures.

3. **Drizzle ORM (`src/db/`)**:
   - Table definitions in `src/db/schema/<entity>.ts` exported via `index.ts`.
   - `snake_case` in SQL / database, `camelCase` in TypeScript.
   - Generate Zod schemas via `drizzle-zod`.

4. **Code Quality Rules**:
   - **ES6 Arrow Functions Only**: `export const Component = (): React.ReactNode => ...`.
   - **Strict TypeScript**: Explicit return types and prop interfaces.
   - **No Redundant `useState` + `useEffect` (Anti-Pattern)**: Compute derived values directly in render body or via `useMemo`. Use React `key` prop for resetting component state, not effects. Keep `useEffect` strictly for external synchronization.
   - **No Dummy UI**: Keep views functional and connected to real context / state.
