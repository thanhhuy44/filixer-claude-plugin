---
name: dev-frontend
description: Frontend-specific development workflow following the 11-step lifecycle (Research -> Explore -> Plan -> Implement -> Test #1 -> Review -> Fix -> Simplify -> Test #2 -> Final Review -> Commit) with UI Builder, Shadcn UI, Ant Design, TanStack Router/Query, Zustand, and MANDATORY Playwright E2E tests.
---

# Frontend Development Workflow (`dev-frontend`)

Specialized frontend engineering workflow adhering to the mandatory 11-step quality lifecycle and **MANDATORY Playwright E2E testing**.

---

## 🚨 MANDATORY PLAYWRIGHT E2E TEST RULE
> Whenever any UI component, page, form, or route is created or updated, you **MUST author corresponding Playwright E2E test specs** in `e2e/<feature>.spec.ts` (or `tests/e2e/<feature>.spec.ts`) and run them with `npx playwright test` or `playwright` MCP. A UI task is **NEVER** done without verified passing E2E tests.

---

## 🚀 Specialized Frontend Workflow

### 1. TASK
- Clarify UI requirements, target responsive viewports, state management needs, and backend API contracts.

### 2. RESEARCH
- Check `package.json` for React version (18 vs 19), styling framework (Tailwind v4), UI libraries (Shadcn UI, Ant Design v6), and Playwright configuration (`playwright.config.ts`).
- Use **`context7` MCP** or **`llm-reader`** agent for official docs:
  - TanStack Query / Table: `https://tanstack.com/llms.txt`
  - Shadcn UI: `https://ui.shadcn.com/llms.txt`
- For Ant Design: Run `antd info <Component> --format json` before writing component code.

### 3. EXPLORE
- Inspect `src/features/` for existing feature modules.
- Check reusable primitives in `src/components/ui/` (Shadcn) and shared hooks in `src/hooks/`.
- Check active stores in `src/stores/` (Zustand).
- Check existing E2E test helpers and specs in `e2e/`.

### 4. PLAN
- Plan component breakdown in `src/features/<feature-name>/`:
  - `index.tsx`: Feature Page with Context Provider.
  - `context/index.tsx`: Feature Context & custom hook.
  - `components/`: Modular child components (`list`, `card`, `create-form`, `delete`).
- Plan form validation schema with Zod & React Hook Form.
- Plan API consumption via oRPC hooks (`orpc.<router>.<method>.useQuery()`).
- **Plan Playwright E2E test cases**: Page load, user input, form submit, error display, responsive layout, toast/notification.

### 5. IMPLEMENT
- **Agent**: Sub-agent **`ui-builder`**
- **Skills**: `ui-module`, `shadcn`, `antd`, `tanstack-router`, `zustand`, `hooks`
- **MCP Servers**: Use `shadcn` MCP to discover/add components; use `antd` MCP for API & styling tokens.
- **Commands**: `/feature-ui`, `/form-zod`, `/spa-route`.
- **Coding Rules**:
  - ES6 Arrow functions only (`export const Comp = (): React.ReactNode => ...`).
  - Explicit typing for props and returns.
  - Form integration with `react-hook-form` + `@hookform/resolvers/zod`.
  - **MANDATORY**: Create Playwright E2E spec in `e2e/<feature>.spec.ts`.

### 6. TEST #1 (First Quality Gate)
- Run `npm run typecheck` (`tsc --noEmit`).
- Run `npm run lint` and `antd lint <path> --format json` (if AntD used).
- Run unit/component tests: `npm test`.
- **Run Playwright E2E Suite & QA Delegation**:
  - **MUST spawn sub-agent `tester-engineer`** via `Agent` tool (`Agent({ subagent_type: 'tester-engineer', prompt: 'Execute Playwright tests in e2e/<feature>.spec.ts, inspect interactive elements, test edge cases, and verify no console/network errors' })`).
  - `tester-engineer` runs the tests, checks real browser behavior, and logs any confirmed defects in `BUG.md`.
- Verify all assertions pass and no unhandled browser console errors appear.

### 7. REVIEW
- Verify responsiveness (Desktop, Tablet, Mobile).
- Check empty, loading, and error states.
- Ensure proper query invalidation on mutation success.

### 8. FIX REVIEW FINDINGS
- Fix any UI glitches, missing props, styling defects, or console warnings.

### 9. SIMPLIFY
- Clean up unused CSS classes, redundant re-renders, and ensure atomic Zustand selectors.

### 10. TEST #2 (BẮT BUỘC)
- Re-run full check including Playwright tests via `tester-engineer`:
  ```bash
  npm run typecheck && npm run lint && npm test && npx playwright test && npm run build
  ```
- Re-verify with `tester-engineer` that all regression tests pass.
- If failed: Fix ➔ Re-run TEST #2 until all green.

### 11. FINAL REVIEW & COMMIT
- Check `git diff` for cleanliness.
- Commit with conventional format and attribution.
