# Filixer Claude Plugin

A comprehensive fullstack development toolkit for Claude Code, empowering rapid development with **Next.js**, **oRPC**, **Drizzle ORM**, **Shadcn UI**, **Ant Design**, **Better-Auth**, **TanStack Query/Table**, and **Playwright**.

---

## 🚀 Features & Capabilities

### 🔌 MCP Servers (`.mcp.json`)

The plugin configures 3 specialized Model Context Protocol (MCP) servers:
- **`antd`**: Ant Design component API metadata, docs, and linting (`@ant-design/cli`).
- **`shadcn`**: Component discovery and interactive installation (`shadcn@latest mcp`).
- **`playwright`**: Browser automation and E2E testing framework (`@playwright/mcp`).

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

- **`ui-module`**: Standards & templates for feature-driven UI modules (`src/features/`).
- **`ant-design`**: Decision guide & offline CLI workflow for Ant Design v6, Pro, and AntD X.
- **`drizzle-orm`**: Database schema design, `relations`, `drizzle-kit` migrations, and `drizzle-zod`.
- **`shadcn-ui`**: Installation guidelines, Tailwind CSS v4 setup, and dark mode integration.
- **`tanstack`**: TanStack Query oRPC integration, query invalidation, and TanStack Data Table specs.
- **`tanstack-router`**: SPA client-side routing, type-safe file routes, search params validation & loaders.
- **`zustand`**: Client-side global state management, persistent storage, and modular store patterns.

---

## 🤖 Dedicated Sub-Agents

- **`db-architect`**: Database Architect for Drizzle ORM schemas, migration management, and entity relations.
- **`orpc-developer`**: Backend & API Engineer for type-safe oRPC routers, Zod validation, and auth procedures.
- **`ui-builder`**: Frontend Engineer for feature-driven UI components with Shadcn UI, AntD, and Tailwind CSS.
- **`tester-engineer`**: Senior QA Engineer for Playwright browser testing, bug reporting, and regression test suites.
- **`llm-reader`**: Context agent for fetching and parsing official `llm.txt` instruction files.

---

## 📦 Installation & Setup

Add this plugin to your Claude Code configuration or project workspace. Ensure your project has the required dependencies (`@orpc/server`, `drizzle-orm`, `better-auth`, `@tanstack/react-query`, etc.) installed.
