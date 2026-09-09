# Filixer Claude Plugin (`filixer`)

A comprehensive fullstack development toolkit for Claude Code, empowering rapid development with **React SPA / TanStack Start (SSR support)**, **oRPC**, **Drizzle ORM**, **Shadcn UI**, **Ant Design**, **Better-Auth**, **TanStack Query/Router/Table**, and **Playwright**.

---

## 🚀 Features & Capabilities

### 🔄 Multi-Phase Development Workflows

The plugin provides a unified development workflow skill and specialized domain skills following an 11-step lifecycle:

- **`/filixer:workflow [fe|be|fullstack]`**: Universal master workflow skill with options for Frontend-only, Backend-only, or Fullstack.
- **`/filixer:dev-frontend`**: Frontend development workflow with UI Builder, Shadcn UI, Ant Design, TanStack Router/Query, Zustand, and Playwright.
- **`/filixer:dev-backend`**: Backend development workflow with DB Architect, oRPC Developer, Drizzle ORM, and Better-Auth.
- **`/filixer:dev-fullstack`**: End-to-end fullstack development workflow coordinating the entire lifecycle from DB to UI and QA.

```text
TASK ──► RESEARCH ──► EXPLORE ──► PLAN ──► IMPLEMENT ──► TEST #1 ──► REVIEW ──► FIX ──► SIMPLIFY ──► TEST #2 (MANDATORY) ──► FINAL REVIEW ──► COMMIT
                                                                                                           │ (IF FAILED)
                                                                                                           └──► FIX ──► RE-RUN TEST #2
```

---

### 🔌 MCP Servers (`.mcp.json`)

The plugin bundles 3 specialized Model Context Protocol (MCP) servers:
- **`antd`**: Ant Design component API metadata, docs, tokens, and linting (`@ant-design/cli mcp`).
- **`shadcn`**: Component discovery, registry lookup, and interactive installation (`shadcn@latest mcp`).
- **`playwright`**: Browser automation and E2E testing framework (`@playwright/mcp`).

---

### 🧠 LSP Server (`.lsp.json`)

The plugin bundles TypeScript / JavaScript Language Server (`typescript-language-server --stdio`) for real-time diagnostics, symbol lookup, and code intelligence across `.ts`, `.tsx`, `.js`, and `.jsx` files.

---

## 📜 Slash Commands

| Command | Description | Target Path |
| :--- | :--- | :--- |
| `/feature-ui` | Generates a base UI feature module pattern | `src/features/<feature_name>/` |
| `/crud-rpc` | Generates a type-safe oRPC CRUD Router | `src/orpc/router/<router_name>.ts` |
| `/drizzle-schema` | Generates Drizzle ORM table & `drizzle-zod` schemas | `src/db/schema/<entity_name>.ts` |
| `/form-zod` | Generates React Hook Form + Zod Form component | `src/components/forms/<form_name>.tsx` |
| `/auth-setup` | Configures Better-Auth server/client & oRPC auth middleware | `src/lib/auth.ts`, `src/orpc/procedure.ts` |
| `/feature-auth-ui` | Generates standard Auth UI components (SignIn, Profile) | `src/features/auth/` |
| `/spa-route` | Generates a type-safe TanStack Router client file route | `src/routes/<path>.tsx` |
| `/spa-auth-client` | Configures Better-Auth React client for SPA apps | `src/lib/auth-client.ts` |

---

## 🛠️ Skills

- **`workflow`**: Universal 11-step development workflow (`fe`, `be`, `fullstack`).
- **`dev-frontend`**: Specialized Frontend development workflow.
- **`dev-backend`**: Specialized Backend development workflow.
- **`dev-fullstack`**: Specialized Fullstack development workflow.
- **`filixer`**: Core architecture guidelines and task routing matrix.
- **`ui-module`**: Standards & templates for feature-driven UI modules (`src/features/`).
- **`antd`**: Decision guide & offline CLI workflow for Ant Design v6, Pro, and AntD X.
- **`drizzle`**: Database schema design, `relations`, `drizzle-kit` migrations, and `drizzle-zod`.
- **`shadcn`**: Installation guidelines, Tailwind CSS v4 setup, and dark mode integration.
- **`tanstack`**: TanStack Query oRPC integration, query invalidation, and TanStack Data Table specs.
- **`tanstack-router`**: SPA client-side routing, type-safe file routes, search params validation & loaders.
- **`zustand`**: Client-side global state management, persistent storage, and modular store patterns.
- **`hooks`**: Essential custom React hooks for auth (`useAuth`), UI disclosure (`useDisclosure`), input debouncing (`useDebounce`), responsive mobile detection (`useIsMobile`), and copy clipboard (`useCopyToClipboard`).

---

## 🪝 Claude Code Lifecycle Hooks (`hooks/hooks.json`)

The plugin configures automated lifecycle hooks using `${CLAUDE_PLUGIN_ROOT}`:

- **`SessionStart`** (`hooks/session-start.js`): Checks workspace readiness (`package.json`, `node_modules`, `.env`).
- **`PreToolUse`** (`hooks/pre-tool-use.js`): Intercepts dangerous Bash commands (`git push --force`, `rm -rf /`, `DROP DATABASE`, `TRUNCATE TABLE`) and returns a blocking exit code 2.
- **`PostToolUse`** (`hooks/post-tool-use.js`): Automatically formats `.ts`, `.tsx`, and `.json` files via Prettier after edits.

---

## 🤖 Dedicated Sub-Agents

- **`db-architect`**: Database Architect for Drizzle ORM schemas, migration management, and entity relations.
- **`orpc-developer`**: Backend & API Engineer for type-safe oRPC routers, Zod validation, and auth procedures.
- **`ui-builder`**: Frontend Engineer for feature-driven UI components with Shadcn UI, AntD, and Tailwind CSS.
- **`tester-engineer`**: Senior QA Engineer for Playwright browser testing, bug reporting, and regression test suites.
- **`llm-reader`**: Dynamic discovery agent for fetching and parsing official `llms.txt` and documentation files using search/fetch tools.

---

## 📦 Installation & Verification

Test locally with Claude Code:
```bash
claude --plugin-dir ./
```

Validate plugin structure:
```bash
claude plugin validate .
```
